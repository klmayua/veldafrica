import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { randomUUID } from "crypto"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// POST /api/admin/newsletters/[id]/send - Send newsletter to subscribers
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get newsletter
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
    })

    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
    }

    if (newsletter.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Newsletter must be published before sending" },
        { status: 400 }
      )
    }

    // Get subscribers based on segments
    const where: any = {
      status: "ACTIVE",
    }

    if (newsletter.segments.length > 0) {
      where.segments = {
        hasSome: newsletter.segments,
      }
    }

    const subscribers = await prisma.subscriber.findMany({ where })

    // Send emails (batch processing)
    const batchSize = 100
    const batches = []

    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize))
    }

    let sentCount = 0

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (subscriber) => {
          try {
            // Add tracking pixel and unsubscribe link
            const trackingPixel = `<img src="${process.env.APP_URL}/api/track/open?e=${subscriber.id}&n=${id}" width="1" height="1" />`
            const unsubscribeLink = `${process.env.APP_URL}/unsubscribe?token=${subscriber.token}`

            const htmlContent = `
              ${newsletter.content}
              ${trackingPixel}
              <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                <p>You're receiving this because you subscribed to The Gateway newsletter from VELD AFRICA.</p>
                <p><a href="${unsubscribeLink}">Unsubscribe</a> | <a href="${process.env.APP_URL}/newsletters/${newsletter.slug}">View in browser</a></p>
              </footer>
            `

            if (resend) {
              await resend.emails.send({
                from: process.env.FROM_EMAIL || "hello@veldafrica.com",
                to: subscriber.email,
                subject: newsletter.subject,
                html: htmlContent,
                headers: {
                  "X-Newsletter-ID": id,
                  "X-Subscriber-ID": subscriber.id,
                },
              })

              // Create email log
              await prisma.emailLog.create({
                data: {
                  subscriberId: subscriber.id,
                  newsletterId: id,
                  email: subscriber.email,
                  subject: newsletter.subject,
                  status: "sent",
                },
              })

              sentCount++
            }
          } catch (error) {
            console.error(`Failed to send to ${subscriber.email}:`, error)
            await prisma.emailLog.create({
              data: {
                subscriberId: subscriber.id,
                newsletterId: id,
                email: subscriber.email,
                subject: newsletter.subject,
                status: "bounced",
              },
            })
          }
        })
      )
    }

    // Update newsletter stats
    await prisma.newsletter.update({
      where: { id },
      data: {
        sentCount,
      },
    })

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: subscribers.length,
    })
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}