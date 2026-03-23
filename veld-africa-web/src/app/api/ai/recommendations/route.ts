import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AIRecommendationEngine } from '@/lib/ai/recommendations';

// GET /api/ai/recommendations - Get personalized recommendations
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
      include: { investor: true },
    });

    if (!user?.investor) {
      // Return trending properties for non-investors
      const properties = await prisma.property.findMany({
        where: { isAvailable: true, isFeatured: true },
        include: { project: true },
        take: 10,
      });

      return NextResponse.json({
        success: true,
        data: properties.map((p) => ({
          propertyId: p.id,
          score: 85,
          factors: {},
          reasons: ['Featured property', 'Popular choice'],
          property: p,
        })),
      });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const recommendations = await AIRecommendationEngine.getRecommendations(
      user.investor.id,
      limit
    );

    // Get full property data for each recommendation
    const propertiesWithData = await Promise.all(
      recommendations.map(async (rec) => {
        const property = await prisma.property.findUnique({
          where: { id: rec.propertyId },
          include: { project: true },
        });
        return { ...rec, property };
      })
    );

    return NextResponse.json({
      success: true,
      data: propertiesWithData.filter((item) => item.property),
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

// POST /api/ai/recommendations/track - Track recommendation interaction
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { propertyId, action } = await req.json();

    if (!propertyId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { investor: true },
    });

    if (!user?.investor) {
      return NextResponse.json(
        { error: 'Investor profile required' },
        { status: 400 }
      );
    }

    await AIRecommendationEngine.recordInteraction(
      user.investor.id,
      propertyId,
      action
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    );
  }
}
