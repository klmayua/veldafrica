import { processWebhookEntry } from "@/lib/whatsapp";
import { NextRequest, NextResponse } from "next/server";

// GET /api/whatsapp/webhook - Verify webhook
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // Verify token
    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified successfully");
      return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse("Verification failed", { status: 403 });
  } catch (error) {
    console.error("Webhook verification error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

// POST /api/whatsapp/webhook - Receive webhook events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log webhook data (for debugging)
    console.log("WhatsApp Webhook received:", JSON.stringify(body, null, 2));

    // Process webhook entries
    const entries = body.entry || [];

    for (const entry of entries) {
      await processWebhookEntry(entry);
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Still return 200 to prevent retries
    return NextResponse.json({ status: "error", message: "Processing failed" });
  }
}
