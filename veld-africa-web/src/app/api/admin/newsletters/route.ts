import { authOptions } from "@/lib/auth"
import { hasProjectAccess, logAudit } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/newsletters - List newsletters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ]
    }

    const newsletters = await prisma.newsletter.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ newsletters })
  } catch (error) {
    console.error("Error fetching newsletters:", error)
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 })
  }
}

// POST /api/admin/newsletters - Create newsletter
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { title, subject, excerpt, content, segments, coverImage } = body

    // Generate unique slug
    const { default: slugify } = await import("slugify")
    let slug = slugify(title, { lower: true, strict: true })
    let counter = 1
    while (await prisma.newsletter.findUnique({ where: { slug } })) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`
      counter++
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        slug,
        title,
        subject,
        excerpt,
        content,
        segments: segments || [],
        coverImage,
        createdById: session.user.id,
      },
    })

    await logAudit({
      userId: session.user.id,
      action: "CREATE",
      entity: "Newsletter",
      entityId: newsletter.id,
      newData: newsletter,
    })

    return NextResponse.json({ newsletter }, { status: 201 })
  } catch (error) {
    console.error("Error creating newsletter:", error)
    return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 })
  }
}