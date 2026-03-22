import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/track/open - Track email open
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("e")
    const newsletterId = searchParams.get("n")

    if (email && newsletterId) {
      // Update email log
      await prisma.emailLog.updateMany({
        where: {
          subscriberId: email,
          newsletterId: newsletterId,
        },
        data: {
          status: "opened",
          openedAt: new Date(),
        },
      })

      // Update subscriber
      await prisma.subscriber.update({
        where: { id: email },
        data: {
          lastOpenAt: new Date(),
          openCount: { increment: 1 },
        },
      })

      // Update newsletter stats
      await prisma.newsletter.update({
        where: { id: newsletterId },
        data: {
          openCount: { increment: 1 },
        },
      })
    }

    // Return 1x1 transparent pixel
    return new NextResponse(Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"), {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    // Still return pixel even on error
    return new NextResponse(Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"), {
      headers: {
        "Content-Type": "image/gif",
      },
    })
  }
}

// GET /api/track/click - Track email click
export async function POST(req: NextRequest) {
  try {
    const { subscriberId, newsletterId, link } = await req.json()

    if (subscriberId && newsletterId) {
      await prisma.emailLog.updateMany({
        where: {
          subscriberId,
          newsletterId,
        },
        data: {
          clickedAt: new Date(),
        },
      })

      await prisma.newsletter.update({
        where: { id: newsletterId },
        data: {
          clickCount: { increment: 1 },
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
  }
}