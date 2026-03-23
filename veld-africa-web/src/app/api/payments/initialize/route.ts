import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PaystackService } from '@/lib/payments/paystack';
import { FlutterwaveService } from '@/lib/payments/flutterwave';
import { v4 as uuidv4 } from 'uuid';

// Initialize payment transaction
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Allow guest payments for bookings
    const body = await req.json();
    const {
      propertyId,
      amount,
      currency = 'NGN',
      provider, // 'paystack' or 'flutterwave'
      type = 'BOOKING',
      email,
      name,
      phone,
      isInstallment = false,
      installmentCount = 1,
      metadata = {},
    } = body;

    if (!propertyId || !amount || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { project: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create or get investor
    let investor = await prisma.investor.findFirst({
      where: { user: { email } },
    });

    if (!investor) {
      // Create investor profile
      investor = await prisma.investor.create({
        data: {
          email,
          phone,
          totalInvested: 0,
          totalReturns: 0,
          activeInvestments: 0,
          user: {
            create: {
              email,
              name: name || email.split('@')[0],
              role: 'VIEWER',
              status: 'ACTIVE',
            },
          },
        },
      });
    }

    // Create investment record
    const investment = await prisma.investment.create({
      data: {
        investorId: investor.id,
        propertyId,
        type,
        status: 'PENDING',
        amount,
        currency,
        isInstallment,
        totalInstallments: installmentCount,
        installmentAmount: isInstallment ? amount / installmentCount : null,
        nextPaymentDue: isInstallment ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
        metadata: {
          ...metadata,
          propertyTitle: property.title,
          propertyType: property.type,
          projectName: property.project.title,
        },
      },
    });

    // Generate unique transaction reference
    const reference = `VELD-${uuidv4()}-${Date.now()}`;

    // Initialize payment with selected provider
    let paymentResult;
    const callbackUrl = `${process.env.APP_URL}/payment/callback`;

    if (provider === 'flutterwave') {
      paymentResult = await FlutterwaveService.initializePayment({
        tx_ref: reference,
        amount,
        currency,
        redirect_url: callbackUrl,
        customer: {
          email,
          name: name || email.split('@')[0],
          phone_number: phone,
        },
        meta: {
          investmentId: investment.id,
          propertyId,
          investorId: investor.id,
        },
        customizations: {
          title: `VELD Africa - ${property.title}`,
          description: `Payment for ${property.title}`,
          logo: `${process.env.APP_URL}/logo.png`,
        },
      });
    } else {
      // Default to Paystack
      paymentResult = await PaystackService.initializePayment({
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        reference,
        callback_url: callbackUrl,
        currency,
        metadata: {
          investmentId: investment.id,
          propertyId,
          investorId: investor.id,
          custom_fields: [
            {
              display_name: 'Property',
              variable_name: 'property_title',
              value: property.title,
            },
            {
              display_name: 'Investment Type',
              variable_name: 'investment_type',
              value: type,
            },
          ],
        },
      });
    }

    if (!paymentResult.success) {
      // Update investment to failed
      await prisma.investment.update({
        where: { id: investment.id },
        data: { status: 'CANCELLED' },
      });

      return NextResponse.json(
        { error: paymentResult.error },
        { status: 500 }
      );
    }

    // Create payment transaction record
    const transaction = await prisma.paymentTransaction.create({
      data: {
        investorId: investor.id,
        investmentId: investment.id,
        provider: provider === 'flutterwave' ? 'FLUTTERWAVE' : 'PAYSTACK',
        status: 'PENDING',
        amount,
        currency,
        fees: 0,
        netAmount: amount,
        providerReference: reference,
        description: `Payment for ${property.title}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        investmentId: investment.id,
        transactionId: transaction.id,
        reference,
        authorization_url: paymentResult.data.authorization_url || paymentResult.data.link,
        amount,
        currency,
      },
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference required' },
        { status: 400 }
      );
    }

    const transaction = await prisma.paymentTransaction.findFirst({
      where: { providerReference: reference },
      include: {
        investment: true,
        investor: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        investmentId: transaction.investmentId,
        createdAt: transaction.createdAt,
        verifiedAt: transaction.verifiedAt,
      },
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to get payment status' },
      { status: 500 }
    );
  }
}
