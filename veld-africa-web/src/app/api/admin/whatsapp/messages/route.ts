import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/whatsapp/messages - List WhatsApp messages
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("contactId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (contactId) where.contactId = contactId;

    const messages = await prisma.whatsAppMessage.findMany({
      where,
      include: {
        contact: {
          select: { phoneNumber: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching WhatsApp messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/admin/whatsapp/messages - Send message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumber, message, type, templateName, imageUrl } = body;

    const { sendWhatsAppMessage } = await import("@/lib/whatsapp");

    const result = await sendWhatsAppMessage({
      phoneNumber,
      message,
      type,
      templateName,
      imageUrl,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}