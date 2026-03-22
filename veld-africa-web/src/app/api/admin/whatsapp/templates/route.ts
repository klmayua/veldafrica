import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/whatsapp/templates - List templates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const templates = await prisma.whatsAppTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/admin/whatsapp/templates - Create template
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
    const { name, category, language, header, body, footer, buttons } = body;

    const template = await prisma.whatsAppTemplate.create({
      data: {
        name,
        category,
        language: language || "en",
        header,
        body,
        footer,
        buttons: buttons || null,
        status: "PENDING", // Needs approval from Meta
      },
    });

    // Note: In production, you would also submit to WhatsApp API for approval
    // POST https://graph.facebook.com/v17.0/{business_account_id}/message_templates

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
