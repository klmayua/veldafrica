import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/whatsapp/broadcasts - List broadcasts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const broadcasts = await prisma.whatsAppBroadcast.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ broadcasts });
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    return NextResponse.json(
      { error: "Failed to fetch broadcasts" },
      { status: 500 }
    );
  }
}

// POST /api/admin/whatsapp/broadcasts - Create broadcast
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      templateId,
      templateParams,
      segments,
      filters,
      scheduledAt,
    } = body;

    // Count total recipients
    const where: any = { status: "ACTIVE" };
    if (segments && segments.length > 0) {
      where.tags = { hasSome: segments };
    }

    const recipientCount = await prisma.whatsAppContact.count({ where });

    const broadcast = await prisma.whatsAppBroadcast.create({
      data: {
        name,
        description,
        templateId,
        templateParams: templateParams || {},
        segments: segments || [],
        filters: filters || null,
        totalRecipients: recipientCount,
        status: scheduledAt ? "SCHEDULED" : "DRAFT",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({ broadcast }, { status: 201 });
  } catch (error) {
    console.error("Error creating broadcast:", error);
    return NextResponse.json(
      { error: "Failed to create broadcast" },
      { status: 500 }
    );
  }
}
