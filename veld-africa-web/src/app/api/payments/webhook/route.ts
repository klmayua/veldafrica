import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaystackWebhook } from '@/lib/payments/paystack';
import { verifyFlutterwaveWebhook } from '@/lib/payments/flutterwave';
import { PaystackService } from '@/lib/payments/paystack';
import { FlutterwaveService } from '@/lib/payments/flutterwave';

// Handle Paystack webhook
async function handlePaystackWebhook(payload: any) {
  const { event, data } = payload;

  if (event === 'charge.success') {
    const reference = data.reference;

    // Find transaction
    const transaction = await prisma.paymentTransaction.findFirst({
      where: { providerReference: reference },
      include: { investment: true },
    });

    if (!transaction || transaction.status === 'SUCCESS') {
      return { received: true };
    }

    // Verify transaction with Paystack
    const verification = await PaystackService.verifyPayment(reference);

    if (verification?.data?.status === 'success') {
      // Update transaction
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          isVerified: true,
          verifiedAt: new Date(),
          fees: data.fees / 100 || 0,
          netAmount: (data.amount - (data.fees || 0)) / 100,
          providerTransactionId: data.id.toString(),
          method: data.channel?.toUpperCase() || 'CARD',
          verificationResponse: verification.data,
          webhookPayload: payload,
          webhookReceived: true,
        },
      });

      // Update investment
      await prisma.investment.update({
        where: { id: transaction.investmentId },
        data: {
          status: 'ACTIVE',
          completedAt: new Date(),
          paidInstallments: { increment: 1 },
        },
      });

      // Create portfolio item
      const investment = await prisma.investment.findUnique({
        where: { id: transaction.investmentId },
        include: { property: true },
      });

      if (investment) {
        await prisma.portfolioItem.create({
          data: {
            investorId: investment.investorId,
            propertyId: investment.propertyId,
            totalValue: investment.amount,
            currentValue: investment.amount,
            status: 'ACTIVE',
          },
        });

        // Update investor totals
        await prisma.investor.update({
          where: { id: investment.investorId },
          data: {
            totalInvested: { increment: investment.amount },
            activeInvestments: { increment: 1 },
          },
        });
      }
    }
  }

  return { received: true };
}

// Handle Flutterwave webhook
async function handleFlutterwaveWebhook(payload: any) {
  const { event, data } = payload;

  if (event === 'charge.completed' && data.status === 'successful') {
    const reference = data.tx_ref;

    // Find transaction
    const transaction = await prisma.paymentTransaction.findFirst({
      where: { providerReference: reference },
      include: { investment: true },
    });

    if (!transaction || transaction.status === 'SUCCESS') {
      return { received: true };
    }

    // Verify transaction with Flutterwave
    const verification = await FlutterwaveService.verifyTransaction(data.id);

    if (verification.success && verification.data.status === 'successful') {
      // Update transaction
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          isVerified: true,
          verifiedAt: new Date(),
          fees: verification.data.app_fee || 0,
          netAmount: verification.data.amount - (verification.data.app_fee || 0),
          providerTransactionId: data.id.toString(),
          method: verification.data.payment_type?.toUpperCase() || 'CARD',
          verificationResponse: verification.data,
          webhookPayload: payload,
          webhookReceived: true,
        },
      });

      // Update investment
      await prisma.investment.update({
        where: { id: transaction.investmentId },
        data: {
          status: 'ACTIVE',
          completedAt: new Date(),
          paidInstallments: { increment: 1 },
        },
      });

      // Create portfolio item
      const investment = await prisma.investment.findUnique({
        where: { id: transaction.investmentId },
        include: { property: true },
      });

      if (investment) {
        await prisma.portfolioItem.create({
          data: {
            investorId: investment.investorId,
            propertyId: investment.propertyId,
            totalValue: investment.amount,
            currentValue: investment.amount,
            status: 'ACTIVE',
          },
        });

        // Update investor totals
        await prisma.investor.update({
          where: { id: investment.investorId },
          data: {
            totalInvested: { increment: investment.amount },
            activeInvestments: { increment: 1 },
          },
        });
      }
    }
  }

  return { received: true };
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Determine provider from headers or payload
    const signature = req.headers.get('x-paystack-signature') ||
                     req.headers.get('verif-hash');

    let result;

    if (req.headers.get('x-paystack-signature')) {
      // Paystack webhook
      if (!verifyPaystackWebhook(signature || '', rawBody)) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      result = await handlePaystackWebhook(payload);
    } else if (req.headers.get('verif-hash')) {
      // Flutterwave webhook
      if (!verifyFlutterwaveWebhook(signature || '', rawBody)) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      result = await handleFlutterwaveWebhook(payload);
    } else {
      return NextResponse.json(
        { error: 'Unknown provider' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
