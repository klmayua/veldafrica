import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NFTPropertyService, WalletUtils } from '@/lib/blockchain/nft';

// POST /api/nft/mint - Mint a new property NFT
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { propertyId, walletAddress, imageUrl } = await req.json();

    if (!propertyId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate wallet address
    if (!WalletUtils.isValidAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
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

    // Check if NFT already exists
    const existingNFT = await prisma.nFTTitle.findUnique({
      where: { propertyId },
    });

    if (existingNFT) {
      return NextResponse.json(
        { error: 'NFT already exists for this property' },
        { status: 400 }
      );
    }

    // Generate metadata
    const metadata = NFTPropertyService.generateMetadata(
      property,
      imageUrl || property.images[0] || '',
      [
        { trait_type: 'Property ID', value: property.id },
        { trait_type: 'Project', value: property.project.title },
        { trait_type: 'Verified', value: 'false' },
      ]
    );

    // Mint NFT
    const nftService = new NFTPropertyService();
    const result = await nftService.mintProperty({
      propertyId: property.id,
      to: walletAddress,
      metadata,
      propertyHash: '',
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to mint NFT' },
        { status: 500 }
      );
    }

    // Save to database
    const nftTitle = await prisma.nFTTitle.create({
      data: {
        propertyId,
        tokenId: result.tokenId!,
        contractAddress: process.env.NFT_CONTRACT_ADDRESS || '',
        network: 'polygon',
        chainId: 137,
        metadataUrl: metadata.external_url,
        imageUrl,
        ownerWallet: walletAddress,
        propertyDetails: metadata.properties,
        status: 'MINTED',
        mintTxHash: result.txHash!,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        nftId: nftTitle.id,
        tokenId: result.tokenId,
        txHash: result.txHash,
      },
    });
  } catch (error) {
    console.error('NFT mint error:', error);
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    );
  }
}
