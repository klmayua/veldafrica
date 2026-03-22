// WhatsApp Business API Service
import axios from "axios";
import crypto from "crypto";
import { prisma } from "./prisma";

// WhatsApp API Configuration
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v17.0";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

const WHATSAPP_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

// Types
interface WhatsAppMessage {
  messaging_product: "whatsapp";
  recipient_type: "individual";
  to: string;
  type: "text" | "image" | "video" | "document" | "template" | "interactive";
  text?: { body: string };
  image?: { link: string; caption?: string };
  template?: {
    name: string;
    language: { code: string };
    components?: any[];
  };
  interactive?: {
    type: "button" | "list" | "product";
    body: { text: string };
    action: any;
  };
}

interface SendMessageOptions {
  phoneNumber: string;
  message: string;
  type?: "text" | "template" | "image";
  templateName?: string;
  templateParams?: string[];
  imageUrl?: string;
}

// Send WhatsApp Message
export async function sendWhatsAppMessage({
  phoneNumber,
  message,
  type = "text",
  templateName,
  templateParams,
  imageUrl,
}: SendMessageOptions) {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    let messageData: WhatsAppMessage = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: type === "template" ? "template" : type === "image" ? "image" : "text",
    };

    if (type === "template" && templateName) {
      messageData.template = {
        name: templateName,
        language: { code: "en" },
        components: templateParams
          ? [
              {
                type: "body",
                parameters: templateParams.map((param) => ({
                  type: "text",
                  text: param,
                })),
              },
            ]
          : undefined,
      };
    } else if (type === "image" && imageUrl) {
      messageData.image = {
        link: imageUrl,
        caption: message,
      };
    } else {
      messageData.text = { body: message };
    }

    const response = await axios.post(
      `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save message to database
    await saveOutgoingMessage({
      phoneNumber: formattedPhone,
      message,
      messageId: response.data.messages?.[0]?.id,
      type: type === "template" ? "TEMPLATE" : type === "image" ? "IMAGE" : "TEXT",
      templateName,
    });

    return {
      success: true,
      messageId: response.data.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("WhatsApp send error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// Send Template Message
export async function sendTemplateMessage(
  phoneNumber: string,
  templateName: string,
  params?: string[]
) {
  return sendWhatsAppMessage({
    phoneNumber,
    message: "",
    type: "template",
    templateName,
    templateParams: params,
  });
}

// Send Interactive Message (Buttons)
export async function sendInteractiveMessage(
  phoneNumber: string,
  body: string,
  buttons: { id: string; title: string }[]
) {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const messageData = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: body },
        action: {
          buttons: buttons.map((btn) => ({
            type: "reply",
            reply: { id: btn.id, title: btn.title },
          })),
        },
      },
    };

    const response = await axios.post(
      `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    await saveOutgoingMessage({
      phoneNumber: formattedPhone,
      message: body,
      messageId: response.data.messages?.[0]?.id,
      type: "INTERACTIVE",
    });

    return {
      success: true,
      messageId: response.data.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("Interactive message error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// Send List Message
export async function sendListMessage(
  phoneNumber: string,
  header: string,
  body: string,
  sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]
) {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const messageData = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: header },
        body: { text: body },
        action: {
          button: "View Options",
          sections: sections.map((section) => ({
            title: section.title,
            rows: section.rows.map((row) => ({
              id: row.id,
              title: row.title,
              description: row.description,
            })),
          })),
        },
      },
    };

    const response = await axios.post(
      `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    await saveOutgoingMessage({
      phoneNumber: formattedPhone,
      message: body,
      messageId: response.data.messages?.[0]?.id,
      type: "INTERACTIVE",
    });

    return {
      success: true,
      messageId: response.data.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("List message error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// Save outgoing message to database
async function saveOutgoingMessage({
  phoneNumber,
  message,
  messageId,
  type,
  templateName,
}: {
  phoneNumber: string;
  message: string;
  messageId?: string;
  type: string;
  templateName?: string;
}) {
  try {
    const contact = await getOrCreateContact(phoneNumber);

    await prisma.whatsAppMessage.create({
      data: {
        contactId: contact.id,
        messageId,
        direction: "OUTBOUND",
        messageType: type,
        content: message,
        templateName,
        status: "SENT",
      },
    });

    // Update contact
    await prisma.whatsAppContact.update({
      where: { id: contact.id },
      data: {
        lastMessageAt: new Date(),
        messageCount: { increment: 1 },
      },
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

// Get or create WhatsApp contact
export async function getOrCreateContact(phoneNumber: string) {
  const formattedPhone = formatPhoneNumber(phoneNumber);

  let contact = await prisma.whatsAppContact.findUnique({
    where: { phoneNumber: formattedPhone },
  });

  if (!contact) {
    contact = await prisma.whatsAppContact.create({
      data: {
        phoneNumber: formattedPhone,
        status: "ACTIVE",
      },
    });

    // Send welcome message to new contact
    await sendWelcomeSequence(formattedPhone);
  }

  return contact;
}

// Welcome message sequence
async function sendWelcomeSequence(phoneNumber: string) {
  const welcomeMessage =
    `Hello and welcome to VELD AFRICA! 🏡\n\n` +
    `I'm your property investment assistant. I can help you with:\n\n` +
    `🏠 Browse available properties\n` +
    `📊 Get investment guides\n` +
    `📅 Schedule viewings\n` +
    `💰 Check price ranges\n` +
    `🌾 Learn about agro investments\n\n` +
    `What would you like to explore today?`;

  await sendWhatsAppMessage({
    phoneNumber,
    message: welcomeMessage,
  });

  // Send interactive buttons after 1 second
  setTimeout(async () => {
    await sendInteractiveMessage(phoneNumber, "Quick options:", [
      { id: "browse_properties", title: "🏠 Properties" },
      { id: "get_guide", title: "📖 Get Guide" },
      { id: "schedule_call", title: "📅 Book Call" },
    ]);
  }, 1000);
}

// Format phone number (remove + and spaces)
function formatPhoneNumber(phone: string): string {
  return phone.replace(/\+/g, "").replace(/\s/g, "").replace(/-/g, "");
}

// Verify webhook signature
export function verifyWebhookSignature(
  body: string,
  signature: string,
  appSecret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", appSecret)
    .update(body, "utf8")
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

// Process incoming webhook
export async function processWebhookEntry(entry: any) {
  const changes = entry.changes || [];

  for (const change of changes) {
    if (change.field === "messages") {
      const value = change.value;
      const messages = value.messages || [];
      const statuses = value.statuses || [];

      // Process incoming messages
      for (const message of messages) {
        await processIncomingMessage(message, value);
      }

      // Process status updates
      for (const status of statuses) {
        await processStatusUpdate(status);
      }
    }
  }
}

// Process incoming message
async function processIncomingMessage(message: any, value: any) {
  const phoneNumber = message.from;
  const messageId = message.id;
  const messageType = message.type;
  const timestamp = new Date(parseInt(message.timestamp) * 1000);

  // Get or create contact
  const contact = await getOrCreateContact(phoneNumber);

  let content = "";
  let buttonResponse = null;
  let listResponse = null;

  // Extract message content based on type
  switch (messageType) {
    case "text":
      content = message.text?.body || "";
      break;
    case "image":
      content = message.image?.caption || "[Image received]";
      break;
    case "document":
      content = `[Document: ${message.document?.filename}]`;
      break;
    case "interactive":
      if (message.interactive?.type === "button_reply") {
        buttonResponse = message.interactive.button_reply?.id;
        content = `Button clicked: ${message.interactive.button_reply?.title}`;
      } else if (message.interactive?.type === "list_reply") {
        listResponse = message.interactive.list_reply?.id;
        content = `List selection: ${message.interactive.list_reply?.title}`;
      }
      break;
    default:
      content = `[${messageType} message received]`;
  }

  // Save message
  await prisma.whatsAppMessage.create({
    data: {
      contactId: contact.id,
      messageId,
      direction: "INBOUND",
      messageType: messageType.toUpperCase(),
      content,
      buttonResponse,
      listResponse,
      status: "DELIVERED",
      metadata: message,
    },
  });

  // Update contact
  await prisma.whatsAppContact.update({
    where: { id: contact.id },
    data: {
      lastMessageAt: timestamp,
      messageCount: { increment: 1 },
      conversationState: determineConversationState(
        contact.conversationState,
        content,
        buttonResponse
      ),
    },
  });

  // Process automation
  await handleAutomation(contact, content, buttonResponse, listResponse);
}

// Determine conversation state
function determineConversationState(
  currentState: string,
  message: string,
  buttonResponse: string | null
): string {
  const lowerMsg = message.toLowerCase();

  if (buttonResponse) {
    if (buttonResponse.includes("property")) return "INQUIRY";
    if (buttonResponse.includes("schedule")) return "BOOKING";
    if (buttonResponse.includes("guide")) return "EDUCATION";
  }

  if (
    lowerMsg.includes("buy") ||
    lowerMsg.includes("price") ||
    lowerMsg.includes("cost") ||
    lowerMsg.includes("property")
  ) {
    return "INQUIRY";
  }

  if (
    lowerMsg.includes("call") ||
    lowerMsg.includes("meeting") ||
    lowerMsg.includes("schedule") ||
    lowerMsg.includes("appointment")
  ) {
    return "BOOKING";
  }

  if (currentState !== "IDLE") {
    return currentState;
  }

  return "IDLE";
}

// Handle automation based on message
async function handleAutomation(
  contact: any,
  message: string,
  buttonResponse: string | null,
  listResponse: string | null
) {
  const phoneNumber = contact.phoneNumber;
  const lowerMsg = message.toLowerCase();

  // Handle button responses
  if (buttonResponse) {
    switch (buttonResponse) {
      case "browse_properties":
      case "view_properties":
        await sendPropertyCategories(phoneNumber);
        return;
      case "get_guide":
      case "download_guide":
        await sendInvestmentGuide(phoneNumber);
        return;
      case "schedule_call":
      case "book_appointment":
        await sendBookingOptions(phoneNumber);
        return;
      case "talk_to_human":
        await handoffToHuman(phoneNumber);
        return;
      default:
        break;
    }
  }

  // Handle list selections
  if (listResponse) {
    if (listResponse.startsWith("prop_")) {
      const category = listResponse.replace("prop_", "");
      await sendPropertiesInCategory(phoneNumber, category);
      return;
    }
  }

  // Keyword responses
  if (lowerMsg.includes("property") || lowerMsg.includes("house")) {
    await sendPropertyCategories(phoneNumber);
  } else if (lowerMsg.includes("price") || lowerMsg.includes("cost")) {
    await sendPriceRanges(phoneNumber);
  } else if (lowerMsg.includes("agro") || lowerMsg.includes("farm")) {
    await sendAgroInformation(phoneNumber);
  } else if (lowerMsg.includes("diaspora") || lowerMsg.includes("abroad")) {
    await sendDiasporaInfo(phoneNumber);
  } else if (lowerMsg.includes("contact") || lowerMsg.includes("call")) {
    await sendBookingOptions(phoneNumber);
  } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
    // Already handled in welcome
    return;
  } else {
    // Default response with menu
    await sendInteractiveMessage(phoneNumber, "I'm here to help! What would you like to do?", [
      { id: "view_properties", title: "🏠 Properties" },
      { id: "get_guide", title: "📖 Get Guide" },
      { id: "talk_to_human", title: "👨‍💼 Talk to Agent" },
    ]);
  }
}

// Send property categories
async function sendPropertyCategories(phoneNumber: string) {
  await sendListMessage(phoneNumber, "Property Categories", "What type of investment are you interested in?", [
    {
      title: "Residential",
      rows: [
        { id: "prop_residential", title: "Luxury Homes", description: "Premium bungalows & duplexes" },
        { id: "prop_apartment", title: "Smart Apartments", description: "IoT-enabled living spaces" },
      ],
    },
    {
      title: "Commercial & Agro",
      rows: [
        { id: "prop_commercial", title: "Commercial", description: "Office spaces & retail" },
        { id: "prop_agro", title: "Agro Real Estate", description: "Farm estates & plantations" },
        { id: "prop_land", title: "Land Banking", description: "Strategic land investments" },
      ],
    },
    {
      title: "International",
      rows: [{ id: "prop_dubai", title: "Dubai Properties", description: "Premium UAE real estate" }],
    },
  ]);
}

// Send properties in category
async function sendPropertiesInCategory(phoneNumber: string, category: string) {
  const categoryInfo: Record<string, { name: string; description: string; price: string }> = {
    residential: {
      name: "Luxury Residential",
      description: "Premium 4-5 bedroom bungalows and duplexes in Lagos and Abuja",
      price: "₦80M - ₦500M",
    },
    apartment: {
      name: "Smart Apartments",
      description: "IoT-enabled apartments with home automation",
      price: "₦45M - ₦150M",
    },
    commercial: {
      name: "Commercial Properties",
      description: "Office spaces, retail outlets in prime locations",
      price: "₦100M - ₦2B",
    },
    agro: {
      name: "Agro Real Estate",
      description: "Palm Grove, Palm Crest, FarmVille estates",
      price: "₦3M - ₦25M",
    },
    land: {
      name: "Land Banking",
      description: "Strategic land parcels in growth corridors",
      price: "₦5M - ₦50M per plot",
    },
    dubai: {
      name: "Dubai Properties",
      description: "Premium apartments in Dubai Marina, Downtown",
      price: "$300K - $2M",
    },
  };

  const info = categoryInfo[category];
  if (info) {
    const message =
      `*${info.name}*\n\n` +
      `${info.description}\n\n` +
      `*Price Range:* ${info.price}\n\n` +
      `Would you like to:\n` +
      `• Schedule a viewing\n` +
      `• Get detailed brochure\n` +
      `• Speak with an advisor`;

    await sendWhatsAppMessage({ phoneNumber, message });

    setTimeout(async () => {
      await sendInteractiveMessage(phoneNumber, "Choose an option:", [
        { id: "schedule_viewing", title: "📅 Schedule Viewing" },
        { id: "get_brochure", title: "📄 Get Brochure" },
        { id: "speak_advisor", title: "👨‍💼 Speak to Advisor" },
      ]);
    }, 1000);
  }
}

// Send price ranges
async function sendPriceRanges(phoneNumber: string) {
  const message =
    `*VELD AFRICA Price Guide* 💰\n\n` +
    `🏠 *Residential:* ₦80M - ₦500M\n` +
    `🏢 *Smart Apartments:* ₦45M - ₦150M\n` +
    `🌴 *Agro Investment:* ₦3M - ₦25M\n` +
    `🏭 *Commercial:* ₦100M - ₦2B\n` +
    `🌍 *Dubai Properties:* $300K - $2M\n\n` +
    `We offer flexible payment plans including:\n` +
    `✓ Outright payment (discounts available)\n` +
    `✓ Installment plans (up to 24 months)\n` +
    `✓ Mortgage partnerships\n\n` +
    `Would you like a personalized quote?`;

  await sendWhatsAppMessage({ phoneNumber, message });
}

// Send agro information
async function sendAgroInformation(phoneNumber: string) {
  const message =
    `*Agro Real Estate Investment* 🌾\n\n` +
    `Invest in farmland without the hassle of farming!\n\n` +
    `*Our Agro Portfolio:*\n` +
    `🌴 *Palm Grove Estate* - Palm oil plantations\n` +
    `🌳 *Palm Crest* - Mixed crop farming\n` +
    `🚜 *FarmVille* - Managed farm estates\n\n` +
    `*Returns:* 15-25% annually\n` +
    `*Minimum:* ₦3M investment\n` +
    `*Payout:* Quarterly dividends\n\n` +
    `We handle all operations, you earn passive income!`;

  await sendWhatsAppMessage({ phoneNumber, message });
}

// Send diaspora information
async function sendDiasporaInfo(phoneNumber: string) {
  const message =
    `*Diaspora Investor Package* 🌍\n\n` +
    `Invest in Nigeria while abroad with confidence!\n\n` +
    `*What we offer:*\n` +
    `✓ Virtual property tours\n` +
    `✓ Legal documentation support\n` +
    `✓ Power of attorney services\n` +
    `✓ Secure international payments\n` +
    `✓ Property management services\n` +
    `✓ Video verification of titles\n\n` +
    `*Popular for diaspora:*\n` +
    `• Off-plan projects (payment flexibility)\n` +
    `• Agro investments (passive income)\n` +
    `• Land banking (long-term growth)`;

  await sendWhatsAppMessage({ phoneNumber, message });
}

// Send investment guide
async function sendInvestmentGuide(phoneNumber: string) {
  const message =
    `*VELD Investment Guide* 📖\n\n` +
    `Here's your free guide to real estate investing:\n\n` +
    `1️⃣ *Understand the Market*\n` +
    `Location, infrastructure, and growth potential\n\n` +
    `2️⃣ *Choose Your Investment*\n` +
    `Match property type with your goals\n\n` +
    `3️⃣ *Verify Documentation*\n` +
    `Always check title deeds and approvals\n\n` +
    `4️⃣ *Plan Your Payments*\n` +
    `Consider installments or mortgages\n\n` +
    `💡 *Pro Tip:* Start with agro investments for lower entry points!\n\n` +
    `Need personalized advice? Reply "CALL" to speak with an advisor.`;

  await sendWhatsAppMessage({ phoneNumber, message });
}

// Send booking options
async function sendBookingOptions(phoneNumber: string) {
  await sendInteractiveMessage(phoneNumber, "How would you like to connect with us?", [
    { id: "book_video_call", title: "📹 Video Call" },
    { id: "book_phone_call", title: "📞 Phone Call" },
    { id: "book_site_visit", title: "🏠 Site Visit" },
  ]);
}

// Handoff to human agent
async function handoffToHuman(phoneNumber: string) {
  const message =
    `Connecting you to a VELD advisor... 👨‍💼\n\n` +
    `Our team is available:\n` +
    `Monday - Friday: 9:00 AM - 6:00 PM\n` +
    `Saturday: 10:00 AM - 4:00 PM\n\n` +
    `Please share:\n` +
    `• Your name\n` +
    `• What you're looking for\n` +
    `• Preferred contact time\n\n` +
    `You can also reach us at:\n` +
    `📧 hello@veldafrica.com\n` +
    `📱 +234 800 000 0000`;

  await sendWhatsAppMessage({ phoneNumber, message });

  // Mark for human follow-up
  const contact = await prisma.whatsAppContact.findUnique({
    where: { phoneNumber },
  });

  if (contact) {
    await prisma.whatsAppContact.update({
      where: { id: contact.id },
      data: {
        isLead: true,
        tags: { push: "human-handoff" },
        nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
  }
}

// Process status update
async function processStatusUpdate(status: any) {
  const messageId = status.id;
  const statusValue = status.status; // sent, delivered, read, failed

  await prisma.whatsAppMessage.updateMany({
    where: { messageId },
    data: {
      status: statusValue.toUpperCase(),
      deliveredAt: statusValue === "delivered" ? new Date() : undefined,
      readAt: statusValue === "read" ? new Date() : undefined,
      failedReason: statusValue === "failed" ? status.errors?.[0]?.message : undefined,
    },
  });
}

// Broadcast message to multiple recipients
export async function broadcastMessage(
  phoneNumbers: string[],
  message: string,
  templateName?: string
) {
  const results = [];

  for (const phoneNumber of phoneNumbers) {
    const result = await sendWhatsAppMessage({
      phoneNumber,
      message,
      type: templateName ? "template" : "text",
      templateName,
    });

    results.push({ phoneNumber, ...result });

    // Rate limiting - wait 100ms between messages
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

// Export configuration
export const whatsAppConfig = {
  phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
  businessAccountId: WHATSAPP_BUSINESS_ACCOUNT_ID,
  webhookVerifyToken: WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  baseUrl: WHATSAPP_BASE_URL,
};

export default {
  sendWhatsAppMessage,
  sendTemplateMessage,
  sendInteractiveMessage,
  sendListMessage,
  broadcastMessage,
  processWebhookEntry,
  verifyWebhookSignature,
  whatsAppConfig,
};
