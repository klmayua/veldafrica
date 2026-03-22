import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  segments: z.array(z.string()).optional(),
  source: z.string().optional(),
  utmCampaign: z.string().optional(),
})

// POST /api/subscribe - Subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      )
    }

    const { email, firstName, lastName, phone, location, segments, source, utmCampaign } = result.data

    // Check if already subscribed
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === "ACTIVE") {
        return NextResponse.json(
          { error: "You're already subscribed!" },
          { status: 409 }
        )
      }

      // Resend confirmation email if pending
      if (existingSubscriber.status === "PENDING") {
        await sendConfirmationEmail(existingSubscriber)
        return NextResponse.json({
          success: true,
          message: "Please check your email to confirm your subscription.",
        })
      }

      // Reactivate if unsubscribed
      if (existingSubscriber.status === "UNSUBSCRIBED") {
        await prisma.subscriber.update({
          where: { id: existingSubscriber.id },
          data: {
            status: "PENDING",
            unsubscribedAt: null,
          },
        })
        await sendConfirmationEmail(existingSubscriber)
        return NextResponse.json({
          success: true,
          message: "Please check your email to confirm your re-subscription.",
        })
      }
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        location,
        segments: segments || ["general"],
        source: source || "website",
        utmCampaign,
        status: "PENDING",
      },
    })

    // Send confirmation email
    await sendConfirmationEmail(subscriber)

    return NextResponse.json({
      success: true,
      message: "Please check your email to confirm your subscription.",
    })
  } catch (error) {
    console.error("Error subscribing:", error)
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    )
  }
}

// GET /api/subscribe/confirm - Confirm subscription
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

    if (subscriber.status === "ACTIVE") {
      return NextResponse.json({
        success: true,
        message: "Your subscription is already confirmed!",
      })
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "ACTIVE",
        confirmedAt: new Date(),
      },
    })

    // Send welcome email
    await sendWelcomeEmail(subscriber)

    return NextResponse.json({
      success: true,
      message: "Your subscription has been confirmed!",
    })
  } catch (error) {
    console.error("Error confirming subscription:", error)
    return NextResponse.json(
      { error: "Failed to confirm subscription" },
      { status: 500 }
    )
  }
}

async function sendConfirmationEmail(subscriber: { id: string; email: string; token: string; firstName?: string | null }) {
  if (!resend) return

  const confirmationLink = `${process.env.APP_URL}/api/subscribe/confirm?token=${subscriber.token}`

  await resend.emails.send({
    from: process.env.FROM_EMAIL || "VELD AFRICA <hello@veldafrica.com>",
    to: subscriber.email,
    subject: "Confirm your subscription to The Gateway",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1B4D3E;">Welcome to The Gateway</h1>
        <p>Hi ${subscriber.firstName || "there"},</p>
        <p>Thank you for subscribing to VELD AFRICA's newsletter, The Gateway.</p>
        <p>To complete your subscription, please click the button below:</p>
        <a href="${confirmationLink}" style="display: inline-block; padding: 12px 24px; background-color: #1B4D3E; color: white; text-decoration: none; border-radius: 6px;">Confirm Subscription</a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't request this subscription, you can ignore this email.</p>
      </div>
    `,
  })
}

async function sendWelcomeEmail(subscriber: { id: string; email: string; firstName?: string | null }) {
  if (!resend) return

  await resend.emails.send({
    from: process.env.FROM_EMAIL || "VELD AFRICA <hello@veldafrica.com>",
    to: subscriber.email,
    subject: "Welcome to The Gateway!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1B4D3E;">Welcome to The Gateway!</h1>
        <p>Hi ${subscriber.firstName || "there"},</p>
        <p>Your subscription is now confirmed. You'll receive our weekly newsletter with:</p>
        <ul>
          <li>Exclusive property opportunities</li>
          <li>Market insights and analysis</li>
          <li>Investment guides for diaspora investors</li>
          <li>Events and webinars</li>
        </ul>
        <p>Stay tuned for our next edition!</p>
        <p>Best regards,<br/>The VELD AFRICA Team</p>
      </div>
    `,
  })
}