import { authOptions } from "@/lib/auth"
import { hasProjectAccess, logAudit } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"

// GET /api/admin/projects - List projects
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Get projects based on user role
    let projects
    if (session.user.role === "SUPER_ADMIN") {
      projects = await prisma.project.findMany({
        where: {
          ...(status && { status: status as any }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          }),
        },
        include: {
          _count: {
            select: { properties: true },
          },
          users: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Get only assigned projects
      const userProjects = await prisma.projectUser.findMany({
        where: { userId: session.user.id },
        include: {
          project: {
            include: {
              _count: {
                select: { properties: true },
              },
              users: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true, avatar: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      projects = userProjects.map((up) => up.project)
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST /api/admin/projects - Create project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permission
    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { title, subtitle, description, location, city, country, amenities, launchDate, completionDate, priceRange } = body

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true })
    let counter = 1
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`
      counter++
    }

    const project = await prisma.project.create({
      data: {
        slug,
        title,
        subtitle,
        description,
        location,
        city,
        country: country || "Nigeria",
        amenities: amenities || [],
        launchDate: launchDate ? new Date(launchDate) : null,
        completionDate: completionDate ? new Date(completionDate) : null,
        priceRange: priceRange || null,
        createdById: session.user.id,
      },
    })

    // Add creator as project admin
    await prisma.projectUser.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        role: "ADMIN",
      },
    })

    // Log audit
    await logAudit({
      userId: session.user.id,
      action: "CREATE",
      entity: "Project",
      entityId: project.id,
      newData: project,
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
