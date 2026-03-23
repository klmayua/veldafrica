import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NFTPropertyService } from '@/lib/blockchain/nft';

// GET /api/nft/[tokenId] - Get NFT details
export async function GET(
  req: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const { tokenId } = params;

    // Get from database
    const nft = await prisma.nFTTitle.findUnique({
      where: { tokenId },
      include: {
        property: {
          include: {
            project: true,
          },
        },
        ownerInvestor: true,
        transfers: {
          orderBy: { transferredAt: 'desc' },
        },
      },
    });

    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    // Get on-chain data
    const nftService = new NFTPropertyService();
    const [isVerified, owner] = await Promise.all([
      nftService.isVerified(tokenId),
      nftService.getOwner(tokenId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...nft,
        onChainData: {
          isVerified,
          owner,
        },
      },
    });
  } catch (error) {
    console.error('Get NFT error:', error);
    return NextResponse.json(
      { error: 'Failed to get NFT details' },
      { status: 500 }
    );
  }
}

// POST /api/nft/[tokenId]/transfer - Transfer NFT ownership
export async function POST(
  req: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const { tokenId } = params;
    const { fromAddress, toAddress, price } = await req.json();

    if (!fromAddress || !toAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Execute transfer on blockchain
    const nftService = new NFTPropertyService();
    const result = await nftService.transferProperty({
      from: fromAddress,
      to: toAddress,
      tokenId,
      price,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Transfer failed' },
        { status: 500 }
      );
    }

    // Update database
    await prisma.nFTTitle.update({
      where: { tokenId },
      data: {
        ownerWallet: toAddress,
        status: 'TRANSFERRED',
      },
    });

    // Record transfer
    await prisma.nFTTransfer.create({
      data: {
        nftId: tokenId,
        fromWallet: fromAddress,
        toWallet: toAddress,
        txHash: result.txHash!,
        salePrice: price || 0,
        transferredAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        txHash: result.txHash,
      },
    });
  } catch (error) {
    console.error('Transfer NFT error:', error);
    return NextResponse.json(
      { error: 'Failed to transfer NFT' },
      { status: 500 }
    );
  }
}
