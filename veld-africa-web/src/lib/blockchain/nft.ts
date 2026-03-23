// NFT Property Title - Blockchain Integration
import { ethers } from 'ethers';
import axios from 'axios';

// Smart Contract ABI (simplified - full ABI would be larger)
const PROPERTY_NFT_ABI = [
  // Minting
  'function mintProperty(address to, string memory tokenURI, bytes32 propertyHash) external returns (uint256)',
  'function batchMintProperties(address[] memory to, string[] memory tokenURIs, bytes32[] memory propertyHashes) external returns (uint256[])',

  // Ownership
  'function transferFrom(address from, address to, uint256 tokenId) external',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external',

  // Metadata
  'function tokenURI(uint256 tokenId) external view returns (string memory)',
  'function propertyHash(uint256 tokenId) external view returns (bytes32)',

  // Verification
  'function verifyProperty(uint256 tokenId) external',
  'function isVerified(uint256 tokenId) external view returns (bool)',

  // Query
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function getPropertyHistory(uint256 tokenId) external view returns (tuple(address from, address to, uint256 timestamp, uint256 price)[] memory)',

  // Events
  'event PropertyMinted(uint256 indexed tokenId, address indexed owner, bytes32 propertyHash)',
  'event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price)',
  'event PropertyVerified(uint256 indexed tokenId, address indexed verifier)',
];

const PROPERTY_NFT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || '';
const RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || '';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    address: string;
    city: string;
    country: string;
    sqft?: number;
    bedrooms?: number;
    bathrooms?: number;
    type: string;
    yearBuilt?: number;
  };
}

export interface MintParams {
  propertyId: string;
  to: string; // Wallet address
  metadata: NFTMetadata;
  propertyHash: string; // Unique hash of property data
}

export interface TransferParams {
  from: string;
  to: string;
  tokenId: string;
  price?: number;
}

export class NFTPropertyService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private wallet: ethers.Wallet | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(
      PROPERTY_NFT_ADDRESS,
      PROPERTY_NFT_ABI,
      this.provider
    );

    if (PRIVATE_KEY) {
      this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    }
  }

  // Mint a new property NFT
  async mintProperty(params: MintParams): Promise<{
    success: boolean;
    tokenId?: string;
    txHash?: string;
    error?: string;
  }> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not configured');
      }

      // Upload metadata to IPFS (using Pinata or similar)
      const metadataUrl = await this.uploadMetadataToIPFS(params.metadata);

      // Create contract instance with signer
      const contractWithSigner = this.contract.connect(this.wallet);

      // Calculate property hash if not provided
      const propertyHash =
        params.propertyHash || this.calculatePropertyHash(params.metadata);

      // Estimate gas
      const gasEstimate = await contractWithSigner.mintProperty.estimateGas(
        params.to,
        metadataUrl,
        propertyHash
      );

      // Mint NFT
      const tx = await contractWithSigner.mintProperty(
        params.to,
        metadataUrl,
        propertyHash,
        { gasLimit: gasEstimate * 120n / 100n } // Add 20% buffer
      );

      // Wait for confirmation
      const receipt = await tx.wait();

      // Extract token ID from event logs
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed?.name === 'PropertyMinted';
        } catch {
          return false;
        }
      });

      const tokenId = event
        ? this.contract.interface.parseLog(event)?.args.tokenId.toString()
        : null;

      return {
        success: true,
        tokenId: tokenId || undefined,
        txHash: receipt?.hash,
      };
    } catch (error: any) {
      console.error('NFT mint error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Transfer NFT ownership
  async transferProperty(params: TransferParams): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not configured');
      }

      const contractWithSigner = this.contract.connect(this.wallet);

      // Use safeTransferFrom for security
      const tx = await contractWithSigner.safeTransferFrom(
        params.from,
        params.to,
        params.tokenId,
        ethers.toUtf8Bytes(params.price?.toString() || '0')
      );

      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt?.hash,
      };
    } catch (error: any) {
      console.error('NFT transfer error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Verify property (by authorized verifier)
  async verifyProperty(tokenId: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not configured');
      }

      const contractWithSigner = this.contract.connect(this.wallet);
      const tx = await contractWithSigner.verifyProperty(tokenId);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt?.hash,
      };
    } catch (error: any) {
      console.error('NFT verify error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get NFT metadata
  async getTokenMetadata(tokenId: string): Promise<NFTMetadata | null> {
    try {
      const tokenURI = await this.contract.tokenURI(tokenId);

      if (tokenURI.startsWith('ipfs://')) {
        const ipfsUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
        const response = await axios.get(ipfsUrl);
        return response.data;
      }

      if (tokenURI.startsWith('http')) {
        const response = await axios.get(tokenURI);
        return response.data;
      }

      return JSON.parse(tokenURI);
    } catch (error) {
      console.error('Get metadata error:', error);
      return null;
    }
  }

  // Get property owner
  async getOwner(tokenId: string): Promise<string | null> {
    try {
      const owner = await this.contract.ownerOf(tokenId);
      return owner;
    } catch (error) {
      console.error('Get owner error:', error);
      return null;
    }
  }

  // Get property history
  async getPropertyHistory(tokenId: string): Promise<
    Array<{
      from: string;
      to: string;
      timestamp: number;
      price: number;
    }>
  > {
    try {
      const history = await this.contract.getPropertyHistory(tokenId);
      return history.map((h: any) => ({
        from: h.from,
        to: h.to,
        timestamp: Number(h.timestamp),
        price: Number(h.price),
      }));
    } catch (error) {
      console.error('Get history error:', error);
      return [];
    }
  }

  // Check if property is verified
  async isVerified(tokenId: string): Promise<boolean> {
    try {
      return await this.contract.isVerified(tokenId);
    } catch (error) {
      return false;
    }
  }

  // Get verification hash
  async getPropertyHash(tokenId: string): Promise<string | null> {
    try {
      const hash = await this.contract.propertyHash(tokenId);
      return hash;
    } catch (error) {
      return null;
    }
  }

  // Upload metadata to IPFS
  private async uploadMetadataToIPFS(
    metadata: NFTMetadata
  ): Promise<string> {
    const PINATA_API_KEY = process.env.PINATA_API_KEY || '';
    const PINATA_SECRET = process.env.PINATA_SECRET_KEY || '';

    if (!PINATA_API_KEY || !PINATA_SECRET) {
      // Fallback: Return data URI for testing
      return `data:application/json;base64,${Buffer.from(
        JSON.stringify(metadata)
      ).toString('base64')}`;
    }

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET,
          },
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('IPFS upload error:', error);
      // Fallback to data URI
      return `data:application/json;base64,${Buffer.from(
        JSON.stringify(metadata)
      ).toString('base64')}`;
    }
  }

  // Calculate unique property hash
  private calculatePropertyHash(metadata: NFTMetadata): string {
    const propertyData = JSON.stringify(metadata.properties);
    return ethers.keccak256(ethers.toUtf8Bytes(propertyData));
  }

  // Generate metadata for property
  static generateMetadata(
    property: any,
    imageUrl: string,
    additionalAttributes: any[] = []
  ): NFTMetadata {
    return {
      name: `${property.title} - VELD Property NFT`,
      description:
        property.description ||
        `Official digital title for ${property.title} on VELD Africa`,
      image: imageUrl,
      external_url: `${process.env.APP_URL}/properties/${property.slug}`,
      attributes: [
        { trait_type: 'Property Type', value: property.type },
        { trait_type: 'Location', value: property.project.city },
        { trait_type: 'Country', value: property.project.country },
        ...(property.bedrooms
          ? [{ trait_type: 'Bedrooms', value: property.bedrooms }]
          : []),
        ...(property.bathrooms
          ? [{ trait_type: 'Bathrooms', value: property.bathrooms }]
          : []),
        ...(property.sqft
          ? [{ trait_type: 'Square Feet', value: property.sqft }]
          : []),
        { trait_type: 'Price', value: property.price?.amount || 0 },
        ...additionalAttributes,
      ],
      properties: {
        address: property.address,
        city: property.project.city,
        country: property.project.country,
        sqft: property.sqft,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        type: property.type,
        yearBuilt: property.yearBuilt,
      },
    };
  }
}

// Smart Contract Deployment Helper
export class ContractDeployer {
  static async deployContract(): Promise<{
    success: boolean;
    address?: string;
    error?: string;
  }> {
    try {
      if (!PRIVATE_KEY) {
        throw new Error('Private key not configured');
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      // Contract bytecode would be here
      const bytecode =
        process.env.NFT_CONTRACT_BYTECODE || '';

      if (!bytecode) {
        throw new Error('Contract bytecode not configured');
      }

      const factory = new ethers.ContractFactory(
        PROPERTY_NFT_ABI,
        bytecode,
        wallet
      );

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const address = await contract.getAddress();

      return {
        success: true,
        address,
      };
    } catch (error: any) {
      console.error('Contract deploy error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Wallet utilities
export class WalletUtils {
  // Generate new wallet
  static generateWallet(): { address: string; privateKey: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  // Validate address
  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Format address for display
  static formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Get balance
  static async getBalance(address: string): Promise<string> {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  }
}
