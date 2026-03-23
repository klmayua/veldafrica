// Flutterwave Payment Integration
import axios from 'axios';

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

interface PaymentInitializeParams {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url?: string;
  customer: {
    email: string;
    phone_number?: string;
    name: string;
  };
  meta?: Record<string, any>;
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  payment_options?: string;
}

export class FlutterwaveService {
  private static getHeaders() {
    return {
      Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  // Initialize payment
  static async initializePayment(params: PaymentInitializeParams) {
    try {
      const response = await axios.post(
        `${FLUTTERWAVE_BASE_URL}/payments`,
        {
          tx_ref: params.tx_ref,
          amount: params.amount,
          currency: params.currency || 'NGN',
          redirect_url: params.redirect_url,
          customer: params.customer,
          meta: params.meta,
          customizations: params.customizations,
          payment_options: params.payment_options || 'card,mobilemoney,ussd,banktransfer',
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Flutterwave initialize error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Verify transaction
  static async verifyTransaction(transactionId: string) {
    try {
      const response = await axios.get(
        `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Flutterwave verify error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Verify by transaction reference
  static async verifyByReference(tx_ref: string) {
    try {
      const response = await axios.get(
        `${FLUTTERWAVE_BASE_URL}/transactions?tx_ref=${tx_ref}`,
        { headers: this.getHeaders() }
      );

      if (response.data.data?.length > 0) {
        return {
          success: true,
          data: response.data.data[0],
        };
      }

      return {
        success: false,
        error: 'Transaction not found',
      };
    } catch (error: any) {
      console.error('Flutterwave verify ref error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Create virtual card
  static async createVirtualCard(params: {
    currency: string;
    amount: number;
    billing_name: string;
    billing_address?: string;
    billing_city?: string;
    billing_state?: string;
    billing_postal_code?: string;
    billing_country?: string;
  }) {
    try {
      const response = await axios.post(
        `${FLUTTERWAVE_BASE_URL}/virtual-cards`,
        {
          ...params,
          debit_currency: params.currency,
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Flutterwave virtual card error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Get banks
  static async getBanks(country: string = 'NG') {
    try {
      const response = await axios.get(
        `${FLUTTERWAVE_BASE_URL}/banks/${country}`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Flutterwave banks error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Create transfer recipient
  static async createTransferRecipient(params: {
    account_bank: string;
    account_number: string;
    country?: string;
    currency?: string;
    beneficiary_name?: string;
  }) {
    try {
      const response = await axios.post(
        `${FLUTTERWAVE_BASE_URL}/beneficiaries`,
        {
          account_bank: params.account_bank,
          account_number: params.account_number,
          country: params.country || 'NG',
          currency: params.currency || 'NGN',
          beneficiary_name: params.beneficiary_name,
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Flutterwave recipient error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Initiate transfer
  static async initiateTransfer(params: {
    account_bank: string;
    account_number: string;
    amount: number;
    currency?: string;
    narration?: string;
    reference: string;
    beneficiary_name?: string;
  }) {
    try {
      const response = await axios.post(
        `${FLUTTERWAVE_BASE_URL}/transfers`,
        {
          account_bank: params.account_bank,
          account_number: params.account_number,
          amount: params.amount,
          currency: params.currency || 'NGN',
          narration: params.narration || 'Investment Payout',
          reference: params.reference,
          beneficiary_name: params.beneficiary_name,
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Flutterwave transfer error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Validate bank account
  static async validateBankAccount(account_number: string, bank_code: string) {
    try {
      const response = await axios.get(
        `${FLUTTERWAVE_BASE_URL}/accounts/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Flutterwave validate error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}

// Webhook verification
export function verifyFlutterwaveWebhook(signature: string, payload: string): boolean {
  const crypto = require('crypto');
  const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET || '';

  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return hash === signature;
}
