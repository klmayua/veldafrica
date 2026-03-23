import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/investor/portfolio - Get investor portfolio
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        investor: {
          include: {
            investments: {
              include: {
                property: {
                  include: {
                    project: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
            portfolioItems: {
              include: {
                property: {
                  include: {
                    project: true,
                  },
                },
              },
            },
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 20,
            },
            documents: {
              orderBy: { createdAt: 'desc' },
            },
            payouts: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        },
      },
    });

    if (!user?.investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      );
    }

    // Calculate portfolio statistics
    const totalInvested = user.investor.investments
      .filter((i) => i.status === 'ACTIVE')
      .reduce((sum, i) => sum + i.amount, 0);

    const totalReturns = user.investor.payouts
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);

    const unrealizedGains = user.investor.portfolioItems
      .filter((p) => p.status === 'ACTIVE')
      .reduce((sum, p) => sum + (p.unrealizedGain || 0), 0);

    const portfolioValue = user.investor.portfolioItems
      .filter((p) => p.status === 'ACTIVE')
      .reduce((sum, p) => sum + p.currentValue, 0);

    const roi = totalInvested > 0
      ? ((totalReturns + unrealizedGains) / totalInvested) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        investor: user.investor,
        stats: {
          totalInvested,
          totalReturns,
          portfolioValue,
          unrealizedGains,
          roi: parseFloat(roi.toFixed(2)),
          activeInvestments: user.investor.activeInvestments,
        },
      },
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// PATCH /api/investor/portfolio - Update investor preferences
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { investor: true },
    });

    if (!user?.investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      );
    }

    const { preferences } = await req.json();

    const updated = await prisma.investor.update({
      where: { id: user.investor.id },
      data: {
        preferences: preferences,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Portfolio update error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}