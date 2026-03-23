import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/virtual-tours - Get all virtual tours or by property
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');

    if (propertyId) {
      const tour = await prisma.virtualTour.findUnique({
        where: { propertyId },
      });

      if (!tour) {
        return NextResponse.json(
          { error: 'Virtual tour not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: tour });
    }

    const tours = await prisma.virtualTour.findMany({
      where: { isActive: true },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: tours });
  } catch (error) {
    console.error('Virtual tour fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch virtual tours' },
      { status: 500 }
    );
  }
}

// POST /api/virtual-tours - Create a new virtual tour
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin permissions
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      propertyId,
      title,
      description,
      panoImageUrl,
      panoVideoUrl,
      scenes,
      hotspots,
      config,
    } = body;

    if (!propertyId || !panoImageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if tour already exists
    const existingTour = await prisma.virtualTour.findUnique({
      where: { propertyId },
    });

    if (existingTour) {
      // Update existing tour
      const updated = await prisma.virtualTour.update({
        where: { propertyId },
        data: {
          title,
          description,
          panoImageUrl,
          panoVideoUrl,
          scenes: scenes || [],
          hotspots: hotspots || [],
          config: config || { autoRotate: true, speed: 1 },
        },
      });

      return NextResponse.json({ success: true, data: updated });
    }

    // Create new tour
    const tour = await prisma.virtualTour.create({
      data: {
        propertyId,
        title: title || property.title,
        description,
        panoImageUrl,
        panoVideoUrl,
        scenes: scenes || [],
        hotspots: hotspots || [],
        config: config || { autoRotate: true, speed: 1 },
      },
    });

    return NextResponse.json({ success: true, data: tour });
  } catch (error) {
    console.error('Virtual tour create error:', error);
    return NextResponse.json(
      { error: 'Failed to create virtual tour' },
      { status: 500 }
    );
  }
}

// PATCH /api/virtual-tours - Update view count
export async function PATCH(req: NextRequest) {
  try {
    const { propertyId } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID required' },
        { status: 400 }
      );
    }

    const updated = await prisma.virtualTour.update({
      where: { propertyId },
      data: {
        viewCount: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Virtual tour update error:', error);
    return NextResponse.json(
      { error: 'Failed to update tour' },
      { status: 500 }
    );
  }
}
