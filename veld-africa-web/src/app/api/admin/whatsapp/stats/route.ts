import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/whatsapp/stats - Get WhatsApp statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get various statistics
    const [
      totalContacts,
      activeContacts,
      leads,
      totalMessages,
      inboundMessages,
      outboundMessages,
      deliveredMessages,
      readMessages,
    ] = await Promise.all([
      prisma.whatsAppContact.count(),
      prisma.whatsAppContact.count({ where: { status: "ACTIVE" } }),
      prisma.whatsAppContact.count({ where: { isLead: true } }),
      prisma.whatsAppMessage.count(),
      prisma.whatsAppMessage.count({ where: { direction: "INBOUND" } }),
      prisma.whatsAppMessage.count({ where: { direction: "OUTBOUND" } }),
      prisma.whatsAppMessage.count({ where: { status: "DELIVERED" } }),
      prisma.whatsAppMessage.count({ where: { status: "READ" } }),
    ]);

    // Get recent messages (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMessages = await prisma.whatsAppMessage.count({
      where: { createdAt: { gte: last24Hours } },
    });

    // Get conversation state distribution
    const stateDistribution = await prisma.whatsAppContact.groupBy({
      by: ["conversationState"],
      _count: { conversationState: true },
    });

    // Get recent activity
    const recentActivity = await prisma.whatsAppMessage.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        contact: {
          select: { phoneNumber: true, name: true },
        },
      },
    });

    return NextResponse.json({
      stats: {
        contacts: {
          total: totalContacts,
          active: activeContacts,
          leads,
        },
        messages: {
          total: totalMessages,
          inbound: inboundMessages,
          outbound: outboundMessages,
          delivered: deliveredMessages,
          read: readMessages,
          recent24h: recentMessages,
        },
        stateDistribution,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching WhatsApp stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
