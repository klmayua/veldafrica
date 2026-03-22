import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/whatsapp/contacts - List WhatsApp contacts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const isLead = searchParams.get("isLead");
    const search = searchParams.get("search");

    const where: any = {};

    if (status) where.status = status;
    if (isLead !== null) where.isLead = isLead === "true";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search } },
      ];
    }

    const contacts = await prisma.whatsAppContact.findMany({
      where,
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching WhatsApp contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST /api/admin/whatsapp/contacts - Create contact and send message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumber, name, message, templateName } = body;

    // Create or update contact
    const contact = await prisma.whatsAppContact.upsert({
      where: { phoneNumber },
      update: {
        name: name || undefined,
        status: "ACTIVE",
      },
      create: {
        phoneNumber,
        name: name || null,
        status: "ACTIVE",
      },
    });

    // Send message if provided
    if (message || templateName) {
      const { sendWhatsAppMessage } = await import("@/lib/whatsapp");
      await sendWhatsAppMessage({
        phoneNumber,
        message: message || "",
        type: templateName ? "template" : "text",
        templateName,
      });
    }

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Error creating WhatsApp contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
