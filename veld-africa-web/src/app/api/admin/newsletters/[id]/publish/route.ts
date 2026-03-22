import { authOptions } from "@/lib/auth"
import { logAudit } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// POST /api/admin/newsletters/[id]/publish - Publish newsletter
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { action } = body // "publish" | "schedule"
    const { scheduledAt } = body

    const updateData: any = {
      status: action === "publish" ? "PUBLISHED" : "SCHEDULED",
    }

    if (action === "publish") {
      updateData.publishedAt = new Date()
    } else if (action === "schedule" && scheduledAt) {
      updateData.scheduledAt = new Date(scheduledAt)
    }

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: updateData,
    })

    await logAudit({
      userId: session.user.id,
      action: action === "publish" ? "PUBLISH" : "SCHEDULE",
      entity: "Newsletter",
      entityId: id,
      newData: newsletter,
    })

    return NextResponse.json({ newsletter })
  } catch (error) {
    console.error("Error publishing newsletter:", error)
    return NextResponse.json({ error: "Failed to publish newsletter" }, { status: 500 })
  }
}

// GET /api/admin/newsletters/[id]/preview - Get newsletter preview
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { name: true },
        },
      },
    })

    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
    }

    return NextResponse.json({ newsletter })
  } catch (error) {
    console.error("Error fetching newsletter:", error)
    return NextResponse.json({ error: "Failed to fetch newsletter" }, { status: 500 })
  }
}