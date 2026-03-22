import { authOptions } from "@/lib/auth"
import { hasProjectAccess, logAudit } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"

// GET /api/admin/projects/[id] - Get single project
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

    // Check access
    const hasAccess = await hasProjectAccess(session.user.id, id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        properties: {
          orderBy: { createdAt: "desc" },
        },
        users: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true, role: true },
            },
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

// PUT /api/admin/projects/[id] - Update project
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permission
    const canEdit = session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN" ||
      await hasProjectAccess(session.user.id, id, "EDITOR")

    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { title, subtitle, description, location, city, country, status, amenities, launchDate, completionDate, priceRange, featuredImage } = body

    // Get old data for audit
    const oldProject = await prisma.project.findUnique({ where: { id } })

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        location,
        city,
        country,
        status,
        amenities: amenities || [],
        launchDate: launchDate ? new Date(launchDate) : null,
        completionDate: completionDate ? new Date(completionDate) : null,
        priceRange: priceRange || null,
        featuredImage,
        updatedById: session.user.id,
      },
    })

    // Log audit
    await logAudit({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Project",
      entityId: id,
      oldData: oldProject,
      newData: project,
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE /api/admin/projects/[id] - Delete project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permission
    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get old data for audit
    const oldProject = await prisma.project.findUnique({ where: { id } })

    await prisma.project.delete({ where: { id } })

    // Log audit
    await logAudit({
      userId: session.user.id,
      action: "DELETE",
      entity: "Project",
      entityId: id,
      oldData: oldProject,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
