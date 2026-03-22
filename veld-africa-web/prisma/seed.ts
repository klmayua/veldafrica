import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create super admin user
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@veldafrica.com" },
    update: {},
    create: {
      email: "admin@veldafrica.com",
      password: await hash("password", 12),
      name: "Super Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  })

  console.log("Created super admin:", superAdmin.email)

  // Create editor user
  const editor = await prisma.user.upsert({
    where: { email: "editor@veldafrica.com" },
    update: {},
    create: {
      email: "editor@veldafrica.com",
      password: await hash("password", 12),
      name: "Content Editor",
      role: "EDITOR",
      status: "ACTIVE",
    },
  })

  console.log("Created editor:", editor.email)

  // Create viewer user
  const viewer = await prisma.user.upsert({
    where: { email: "viewer@veldafrica.com" },
    update: {},
    create: {
      email: "viewer@veldafrica.com",
      password: await hash("password", 12),
      name: "Property Viewer",
      role: "VIEWER",
      status: "ACTIVE",
    },
  })

  console.log("Created viewer:", viewer.email)

  // Create sample projects
  const palmGroveProject = await prisma.project.create({
    data: {
      slug: "palm-grove-estate",
      title: "Palm Grove Estate",
      subtitle: "Premium Agro-Investment Opportunity",
      description: "A 500-hectare palm oil plantation offering guaranteed returns through managed farming operations.",
      location: "Epe, Lagos",
      city: "Lagos",
      country: "Nigeria",
      status: "ACTIVE",
      totalUnits: 500,
      availableUnits: 320,
      priceRange: { min: 5000000, max: 25000000, currency: "NGN" },
      amenities: ["Irrigation System", "Processing Plant", "Security", "Road Access"],
      createdById: superAdmin.id,
    },
  })

  console.log("Created project:", palmGroveProject.title)

  // Add editor to project
  await prisma.projectUser.create({
    data: {
      projectId: palmGroveProject.id,
      userId: editor.id,
      role: "EDITOR",
    },
  })

  // Add viewer to project
  await prisma.projectUser.create({
    data: {
      projectId: palmGroveProject.id,
      userId: viewer.id,
      role: "VIEWER",
    },
  })

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      slug: "palm-plot-001",
      projectId: palmGroveProject.id,
      title: "1 Hectare Palm Plot",
      description: "Fully maintained 1-hectare palm oil plantation plot with guaranteed quarterly returns.",
      type: "AGRO",
      address: "Palm Grove Estate, Epe-Ikorodu Road",
      price: { amount: 5000000, currency: "NGN", negotiable: false },
      area: "1 hectare",
      features: ["Mature Trees", "Irrigation", "Access Road"],
      isAvailable: true,
      isFeatured: true,
    },
  })

  console.log("Created property:", property1.title)

  // Create sample subscribers
  const subscriber1 = await prisma.subscriber.create({
    data: {
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      location: "United Kingdom",
      segments: ["diaspora", "agro-investor"],
      status: "ACTIVE",
      confirmedAt: new Date(),
      source: "website",
    },
  })

  console.log("Created subscriber:", subscriber1.email)

  // Create sample newsletter
  const newsletter = await prisma.newsletter.create({
    data: {
      slug: "welcome-to-veld",
      title: "Welcome to VELD AFRICA",
      subject: "Your Gateway to African Real Estate",
      excerpt: "Discover investment opportunities across Nigeria and Dubai.",
      content: "<h1>Welcome to VELD AFRICA</h1><p>Thank you for subscribing to The Gateway. You'll receive weekly insights on property investments.</p>",
      status: "PUBLISHED",
      publishedAt: new Date(),
      segments: ["general"],
      createdById: superAdmin.id,
    },
  })

  console.log("Created newsletter:", newsletter.title)

  console.log("\n✅ Seeding complete!")
  console.log("\nLogin credentials:")
  console.log("  Super Admin: admin@veldafrica.com / password")
  console.log("  Editor:      editor@veldafrica.com / password")
  console.log("  Viewer:      viewer@veldafrica.com / password")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
