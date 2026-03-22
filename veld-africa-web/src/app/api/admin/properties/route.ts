import { authOptions } from "@/lib/auth"
import { hasProjectAccess, logAudit } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"

// GET /api/admin/properties - List properties
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const type = searchParams.get("type")
    const isAvailable = searchParams.get("isAvailable")
    const isFeatured = searchParams.get("isFeatured")
    const search = searchParams.get("search")

    const where: any = {}

    if (projectId) where.projectId = projectId
    if (type) where.type = type
    if (isAvailable !== null) where.isAvailable = isAvailable === "true"
    if (isFeatured !== null) where.isFeatured = isFeatured === "true"
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ]
    }

    // If not super admin, filter by accessible projects
    if (session.user.role !== "SUPER_ADMIN") {
      const userProjects = await prisma.projectUser.findMany({
        where: { userId: session.user.id },
        select: { projectId: true },
      })
      const projectIds = userProjects.map((up) => up.projectId)
      where.projectId = { in: projectIds }
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        project: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

// POST /api/admin/properties - Create property
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      projectId,
      title,
      description,
      type,
      address,
      unit,
      price,
      bedrooms,
      bathrooms,
      sqft,
      images,
      floorPlan,
      videoTour,
      features,
      metaTitle,
      metaDescription,
    } = body

    // Check project access
    const hasAccess = await hasProjectAccess(session.user.id, projectId, "EDITOR")
    if (!hasAccess && !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true })
    let counter = 1
    while (await prisma.property.findUnique({ where: { slug } })) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`
      counter++
    }

    const property = await prisma.property.create({
      data: {
        slug,
        projectId,
        title,
        description,
        type,
        address,
        unit,
        price,
        bedrooms,
        bathrooms,
        sqft,
        images: images || [],
        floorPlan,
        videoTour,
        features: features || [],
        metaTitle,
        metaDescription,
      },
    })

    // Update project available units
    await prisma.project.update({
      where: { id: projectId },
      data: {
        availableUnits: { increment: 1 },
        totalUnits: { increment: 1 },
      },
    })

    await logAudit({
      userId: session.user.id,
      action: "CREATE",
      entity: "Property",
      entityId: property.id,
      newData: property,
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
