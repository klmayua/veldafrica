import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/unsubscribe - Unsubscribe from newsletter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { token },
    })

    if (!subscriber) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    if (subscriber.status === "UNSUBSCRIBED") {
      return NextResponse.json({
        success: true,
        message: "You're already unsubscribed.",
      })
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed successfully.",
    })
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    )
  }
}
