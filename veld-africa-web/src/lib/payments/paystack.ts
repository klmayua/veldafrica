// Paystack Payment Integration
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaymentInitializeParams {
  email: string;
  amount: number; // In kobo (smallest currency unit)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  currency?: string;
  channels?: string[];
}

interface PaymentVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer: {
      email: string;
      id: number;
    };
    metadata: Record<string, any>;
    paid_at: string | null;
    channel: string;
  };
}

export class PaystackService {
  private static getHeaders() {
    return {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  // Initialize payment transaction
  static async initializePayment(params: PaymentInitializeParams) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: params.email,
          amount: params.amount,
          reference: params.reference,
          callback_url: params.callback_url,
          metadata: params.metadata,
          currency: params.currency || 'NGN',
          channels: params.channels || ['card', 'bank_transfer', 'ussd', 'mobile_money'],
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Paystack initialize error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Verify payment transaction
  static async verifyPayment(reference: string): Promise<PaymentVerifyResponse | null> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack verify error:', error.response?.data || error.message);
      return null;
    }
  }

  // Create payment page for property
  static async createPaymentPage(params: {
    name: string;
    description: string;
    amount: number;
    slug?: string;
    redirect_url?: string;
  }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/page`,
        {
          name: params.name,
          description: params.description,
          amount: params.amount,
          slug: params.slug,
          redirect_url: params.redirect_url,
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Paystack page error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Create transfer recipient (for payouts)
  static async createTransferRecipient(params: {
    type: 'nuban' | 'mobile_money' | 'basa';
    name: string;
    account_number: string;
    bank_code: string;
    currency?: string;
  }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transferrecipient`,
        {
          type: params.type,
          name: params.name,
          account_number: params.account_number,
          bank_code: params.bank_code,
          currency: params.currency || 'NGN',
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Paystack recipient error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Initiate transfer (for payouts)
  static async initiateTransfer(params: {
    source: string;
    amount: number;
    recipient: string;
    reference: string;
    reason?: string;
  }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transfer`,
        {
          source: params.source,
          amount: params.amount,
          recipient: params.recipient,
          reference: params.reference,
          reason: params.reason || 'Investment Payout',
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Paystack transfer error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Get banks list
  static async getBanks() {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/bank?currency=NGN`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Paystack banks error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}

// Webhook verification
export function verifyPaystackWebhook(signature: string, payload: string): boolean {
  const crypto = require('crypto');
  const secret = process.env.PAYSTACK_SECRET_KEY || '';

  const hash = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest('hex');

  return hash === signature;
}
