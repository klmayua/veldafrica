import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { randomUUID } from "crypto"

const chatSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  pageUrl: z.string().optional(),
})

// POST /api/chat - Send message to chatbot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = chatSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    const { message, sessionId: providedSessionId, email, name, phone, pageUrl } = result.data

    // Generate or use existing session ID
    const sessionId = providedSessionId || randomUUID()

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        email,
        name,
        phone,
        message,
        pageUrl,
        isFromBot: false,
      },
    })

    // Generate bot response
    const botResponse = generateBotResponse(message, pageUrl)

    // Save bot response
    const botMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        message: botResponse.text,
        isFromBot: true,
        intent: botResponse.intent,
      },
    })

    // Mark as lead if contact info provided
    if (email || phone) {
      await prisma.chatMessage.update({
        where: { id: userMessage.id },
        data: { isLead: true },
      })
    }

    return NextResponse.json({
      sessionId,
      messages: [
        { id: userMessage.id, text: message, isFromBot: false },
        { id: botMessage.id, text: botResponse.text, isFromBot: true, actions: botResponse.actions },
      ],
    })
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}

// GET /api/chat/[sessionId] - Get chat history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ sessionId, messages })
  } catch (error) {
    console.error("Error fetching chat:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    )
  }
}

interface BotResponse {
  text: string
  intent: string
  actions?: { label: string; url?: string; action?: string }[]
}

function generateBotResponse(message: string, pageUrl?: string): BotResponse {
  const lowerMessage = message.toLowerCase()

  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return {
      text: "Hello! Welcome to VELD AFRICA. I'm here to help you explore our property investment opportunities. How can I assist you today?",
      intent: "greeting",
      actions: [
        { label: "View Properties", action: "navigate_properties" },
        { label: "Get Investment Guide", action: "show_guide" },
        { label: "Contact Sales", action: "show_contact" },
      ],
    }
  }

  // Property inquiries
  if (lowerMessage.includes("property") || lowerMessage.includes("house") || lowerMessage.includes("land")) {
    return {
      text: "We have a diverse portfolio including luxury residences in Lagos and Dubai, agro-investments like Palm Grove Estates, off-plan developments, and commercial spaces. Would you like to browse our current listings or get recommendations based on your investment goals?",
      intent: "property_inquiry",
      actions: [
        { label: "Browse Properties", url: "#properties" },
        { label: "Schedule Viewing", action: "schedule_viewing" },
        { label: "Download Brochure", action: "download_brochure" },
      ],
    }
  }

  // Price/Budget inquiries
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much") || lowerMessage.includes("budget")) {
    return {
      text: "Our properties range from ₦3M for agro-investments (FarmVille) to ₦450M for premium commercial spaces. Dubai properties start from $450K. Would you like me to connect you with an advisor who can provide detailed pricing for your specific interests?",
      intent: "pricing_inquiry",
      actions: [
        { label: "Get Price List", action: "request_pricing" },
        { label: "ROI Calculator", action: "show_calculator" },
        { label: "Speak to Advisor", action: "schedule_call" },
      ],
    }
  }

  // Agro investment
  if (lowerMessage.includes("farm") || lowerMessage.includes("palm") || lowerMessage.includes("agro") || lowerMessage.includes("agriculture")) {
    return {
      text: "Our agro-real estate portfolio includes Palm Grove Estate, Palm Crest, and FarmVille. These are managed farmland investments with quarterly dividend payouts. Starting from ₦3M, you can earn passive income while we handle all operations.",
      intent: "agro_inquiry",
      actions: [
        { label: "View Agro Projects", url: "#properties" },
        { label: "ROI Projection", action: "agro_roi" },
        { label: "Farm Visit", action: "schedule_visit" },
      ],
    }
  }

  // Diaspora/International
  if (lowerMessage.includes("diaspora") || lowerMessage.includes("abroad") || lowerMessage.includes("overseas") || lowerMessage.includes("uk") || lowerMessage.includes("us") || lowerMessage.includes("canada")) {
    return {
      text: "We specialize in helping diaspora investors! Our Diaspora Investment Package includes legal support, power of attorney services, virtual tours, and secure payment processing. Many of our clients are based in the UK, US, Canada, and UAE.",
      intent: "diaspora_inquiry",
      actions: [
        { label: "Diaspora Guide", action: "download_diaspora_guide" },
        { label: "Video Consultation", action: "schedule_video_call" },
        { label: "Testimonials", action: "show_testimonials" },
      ],
    }
  }

  // Contact/Meeting
  if (lowerMessage.includes("contact") || lowerMessage.includes("call") || lowerMessage.includes("speak") || lowerMessage.includes("talk") || lowerMessage.includes("advisor")) {
    return {
      text: "I'd be happy to connect you with our investment advisors. You can reach us at hello@veldafrica.com, call +234 800 000 0000, or schedule a consultation. Our team is available Monday-Friday, 9am-6pm WAT.",
      intent: "contact_request",
      actions: [
        { label: "Schedule Consultation", action: "schedule_consultation" },
        { label: "Call Now", url: "tel:+2348000000000" },
        { label: "Email Us", url: "mailto:hello@veldafrica.com" },
      ],
    }
  }

  // Newsletter
  if (lowerMessage.includes("newsletter") || lowerMessage.includes("email updates") || lowerMessage.includes("subscribe")) {
    return {
      text: "Subscribe to 'The Gateway' - our weekly newsletter with exclusive property opportunities, market insights, and investment guides. You can sign up at the bottom of our homepage.",
      intent: "newsletter_inquiry",
      actions: [
        { label: "Subscribe Now", url: "#newsletter" },
        { label: "Past Issues", action: "show_archive" },
      ],
    }
  }

  // Podcast
  if (lowerMessage.includes("podcast") || lowerMessage.includes("veld sessions")) {
    return {
      text: "The VELD Sessions podcast features conversations with industry experts and successful investors. Available on Spotify, Apple Podcasts, and YouTube. New episodes every Wednesday!",
      intent: "podcast_inquiry",
      actions: [
        { label: "Listen Now", url: "#podcast" },
        { label: "Spotify", url: "https://open.spotify.com" },
        { label: "Apple Podcasts", url: "https://podcasts.apple.com" },
      ],
    }
  }

  // FAQ - Documentation
  if (lowerMessage.includes("document") || lowerMessage.includes("title") || lowerMessage.includes("deed") || lowerMessage.includes("legal")) {
    return {
      text: "All our properties come with verified titles and complete documentation. We work with top legal firms to ensure secure transactions. For diaspora clients, we offer power of attorney services and video verification.",
      intent: "documentation_inquiry",
      actions: [
        { label: "Documentation Guide", action: "download_legal_guide" },
        { label: "Legal Partners", action: "show_partners" },
      ],
    }
  }

  // FAQ - Payment
  if (lowerMessage.includes("payment") || lowerMessage.includes("pay") || lowerMessage.includes("installment") || lowerMessage.includes("mortgage")) {
    return {
      text: "We offer flexible payment plans including outright payments, installment plans (up to 24 months), and mortgage partnerships with leading banks. Diaspora clients can pay via wire transfer or domiciliary accounts.",
      intent: "payment_inquiry",
      actions: [
        { label: "Payment Plans", action: "show_payment_plans" },
        { label: "Mortgage Info", action: "mortgage_info" },
      ],
    }
  }

  // Default response
  return {
    text: "Thank you for your message. To better assist you, could you tell me more about what you're looking for? Are you interested in residential properties, commercial investments, agro-real estate, or our Dubai portfolio? Or would you like to speak directly with an advisor?",
    intent: "general",
    actions: [
      { label: "Browse Properties", url: "#properties" },
      { label: "Contact Sales", action: "show_contact" },
      { label: "Download Brochure", action: "download_brochure" },
    ],
  }
}