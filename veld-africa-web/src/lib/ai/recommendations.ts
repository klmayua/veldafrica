// AI Property Recommendation Engine
import { prisma } from '@/lib/prisma';

interface InvestorProfile {
  id: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocations: string[];
  propertyTypes: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  investmentGoals: string[];
  pastInvestments: string[];
}

interface PropertyVector {
  id: string;
  price: number;
  type: string;
  location: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  roi?: number;
  features: string[];
  isFeatured: boolean;
  viewCount: number;
}

interface RecommendationScore {
  propertyId: string;
  score: number;
  factors: {
    priceMatch: number;
    locationMatch: number;
    typeMatch: number;
    roiPotential: number;
    featureMatch: number;
    popularity: number;
    recency: number;
  };
  reasons: string[];
}

export class AIRecommendationEngine {
  // Main recommendation function
  static async getRecommendations(
    investorId: string,
    limit: number = 10
  ): Promise<RecommendationScore[]> {
    // Get investor profile
    const investor = await prisma.investor.findUnique({
      where: { id: investorId },
      include: {
        investments: {
          include: {
            property: true,
          },
        },
        portfolioItems: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!investor) {
      // Return trending properties if no profile
      return this.getTrendingProperties(limit);
    }

    // Build investor profile vector
    const profile: InvestorProfile = this.buildInvestorProfile(investor);

    // Get available properties
    const properties = await prisma.property.findMany({
      where: {
        isAvailable: true,
        NOT: {
          id: {
            in: investor.investments.map((i) => i.propertyId),
          },
        },
      },
      include: {
        project: true,
      },
    });

    // Convert properties to vectors
    const propertyVectors: PropertyVector[] = properties.map((p) => ({
      id: p.id,
      price: p.price?.amount || 0,
      type: p.type,
      location: p.project.location,
      city: p.project.city,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      roi: this.calculateROI(p),
      features: p.features,
      isFeatured: p.isFeatured,
      viewCount: Math.floor(Math.random() * 1000), // Would be actual view count
    }));

    // Calculate similarity scores
    const scores = propertyVectors.map((property) =>
      this.calculateSimilarityScore(profile, property)
    );

    // Sort by score and return top recommendations
    const sortedScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Save recommendations to database
    await this.saveRecommendations(investorId, sortedScores);

    return sortedScores;
  }

  // Build investor profile from data
  private static buildInvestorProfile(investor: any): InvestorProfile {
    const preferences = investor.preferences || {};
    const pastInvestments = investor.investments.map((i: any) => i.property.type);

    // Calculate budget range from past investments
    const amounts = investor.investments.map((i: any) => i.amount);
    const avgInvestment = amounts.length > 0
      ? amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length
      : 0;

    return {
      id: investor.id,
      budgetMin: avgInvestment * 0.8 || 500000,
      budgetMax: avgInvestment * 1.5 || 50000000,
      preferredLocations: preferences.locations || ['Lagos', 'Abuja'],
      propertyTypes: preferences.propertyTypes || this.inferPreferredTypes(pastInvestments),
      riskTolerance: preferences.riskTolerance || 'medium',
      investmentGoals: preferences.goals || ['capital_appreciation', 'rental_income'],
      pastInvestments,
    };
  }

  // Infer property types from past investments
  private static inferPreferredTypes(pastTypes: string[]): string[] {
    const typeCounts: Record<string, number> = {};
    pastTypes.forEach((type) => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const sorted = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);

    return sorted.length > 0 ? sorted : ['RESIDENTIAL', 'AGRO'];
  }

  // Calculate ROI for a property
  private static calculateROI(property: any): number {
    // Simplified ROI calculation
    // In real implementation, this would use market data
    const baseROI = property.type === 'AGRO' ? 15 : 10;
    const locationMultiplier = property.project.city === 'Lagos' ? 1.2 : 1.0;
    return baseROI * locationMultiplier;
  }

  // Calculate similarity score between investor and property
  private static calculateSimilarityScore(
    profile: InvestorProfile,
    property: PropertyVector
  ): RecommendationScore {
    const factors = {
      priceMatch: this.calculatePriceMatch(profile, property),
      locationMatch: this.calculateLocationMatch(profile, property),
      typeMatch: this.calculateTypeMatch(profile, property),
      roiPotential: this.calculateROIPotential(profile, property),
      featureMatch: this.calculateFeatureMatch(profile, property),
      popularity: this.calculatePopularity(property),
      recency: this.calculateRecency(property),
    };

    // Weighted score calculation
    const weights = {
      priceMatch: 0.25,
      locationMatch: 0.20,
      typeMatch: 0.15,
      roiPotential: 0.20,
      featureMatch: 0.10,
      popularity: 0.05,
      recency: 0.05,
    };

    const score = Object.entries(factors).reduce((acc, [key, value]) => {
      return acc + value * weights[key as keyof typeof weights];
    }, 0);

    const reasons = this.generateReasons(factors, property);

    return {
      propertyId: property.id,
      score: Math.min(Math.round(score * 100), 100),
      factors,
      reasons,
    };
  }

  // Price match calculation
  private static calculatePriceMatch(
    profile: InvestorProfile,
    property: PropertyVector
  ): number {
    if (!profile.budgetMax || !profile.budgetMin) return 0.5;

    if (property.price > profile.budgetMax) return 0;
    if (property.price < profile.budgetMin) return 0.6;

    // Ideal price is 60-80% of max budget
    const ratio = property.price / profile.budgetMax;
    if (ratio >= 0.6 && ratio <= 0.8) return 1;
    return 1 - Math.abs(0.7 - ratio);
  }

  // Location match calculation
  private static calculateLocationMatch(
    profile: InvestorProfile,
    property: PropertyVector
  ): number {
    const locationMatch = profile.preferredLocations.some(
      (loc) =>
        property.location.toLowerCase().includes(loc.toLowerCase()) ||
        property.city.toLowerCase().includes(loc.toLowerCase())
    );
    return locationMatch ? 1 : 0.3;
  }

  // Property type match calculation
  private static calculateTypeMatch(
    profile: InvestorProfile,
    property: PropertyVector
  ): number {
    return profile.propertyTypes.includes(property.type) ? 1 : 0.4;
  }

  // ROI potential calculation
  private static calculateROIPotential(
    profile: InvestorProfile,
    property: PropertyVector
  ): number {
    const expectedROI = property.roi || 10;

    switch (profile.riskTolerance) {
      case 'high':
        return expectedROI >= 15 ? 1 : expectedROI / 15;
      case 'low':
        return expectedROI >= 8 && expectedROI <= 12 ? 1 : 0.6;
      default: // medium
        return expectedROI >= 10 ? 1 : expectedROI / 10;
    }
  }

  // Feature match calculation
  private static calculateFeatureMatch(
    profile: InvestorProfile,
    property: PropertyVector
  ): number {
    // Simple feature scoring
    const premiumFeatures = ['pool', 'gym', 'smart_home', 'solar', 'security'];
    const matchingFeatures = property.features.filter((f) =>
      premiumFeatures.some((pf) => f.toLowerCase().includes(pf))
    );
    return Math.min(matchingFeatures.length / 3, 1);
  }

  // Popularity score
  private static calculatePopularity(property: PropertyVector): number {
    // Normalize view count to 0-1 range
    const maxViews = 1000;
    return Math.min(property.viewCount / maxViews, 1);
  }

  // Recency score
  private static calculateRecency(property: PropertyVector): number {
    // Newer properties get higher scores
    return property.isFeatured ? 1 : 0.5;
  }

  // Generate human-readable reasons
  private static generateReasons(
    factors: RecommendationScore['factors'],
    property: PropertyVector
  ): string[] {
    const reasons: string[] = [];

    if (factors.priceMatch > 0.8) {
      reasons.push('Within your budget range');
    }
    if (factors.locationMatch > 0.8) {
      reasons.push(`Located in ${property.city}`);
    }
    if (factors.roiPotential > 0.8) {
      reasons.push(`High ROI potential (${property.roi}%)`);
    }
    if (factors.typeMatch > 0.8) {
      reasons.push(`Matches your preferred property type`);
    }
    if (factors.popularity > 0.7) {
      reasons.push('Popular among investors');
    }
    if (factors.featureMatch > 0.7) {
      reasons.push('Features premium amenities');
    }

    return reasons.length > 0 ? reasons : ['Matches your investment profile'];
  }

  // Save recommendations to database
  private static async saveRecommendations(
    investorId: string,
    recommendations: RecommendationScore[]
  ): Promise<void> {
    // Delete old recommendations
    await prisma.aIRecommendation.deleteMany({
      where: {
        investorId,
        isInvested: false,
      },
    });

    // Create new recommendations
    await prisma.aIRecommendation.createMany({
      data: recommendations.map((rec) => ({
        investorId,
        propertyId: rec.propertyId,
        score: rec.score,
        reasons: rec.reasons,
        factors: rec.factors,
      })),
    });
  }

  // Get trending properties (fallback)
  private static async getTrendingProperties(
    limit: number
  ): Promise<RecommendationScore[]> {
    const properties = await prisma.property.findMany({
      where: { isAvailable: true },
      include: { project: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    return properties.map((p) => ({
      propertyId: p.id,
      score: p.isFeatured ? 95 : 70,
      factors: {
        priceMatch: 0.5,
        locationMatch: 0.5,
        typeMatch: 0.5,
        roiPotential: 0.7,
        featureMatch: 0.5,
        popularity: p.isFeatured ? 1 : 0.5,
        recency: 0.5,
      },
      reasons: p.isFeatured
        ? ['Featured property', 'High demand location']
        : ['New listing', 'Available now'],
    }));
  }

  // Record user interaction with recommendation
  static async recordInteraction(
    investorId: string,
    propertyId: string,
    action: 'view' | 'save' | 'dismiss' | 'invest'
  ): Promise<void> {
    const updateData: any = {};
    const now = new Date();

    switch (action) {
      case 'view':
        updateData.isViewed = true;
        updateData.viewedAt = now;
        break;
      case 'save':
        updateData.isSaved = true;
        updateData.savedAt = now;
        break;
      case 'dismiss':
        updateData.isDismissed = true;
        updateData.dismissedAt = now;
        break;
      case 'invest':
        updateData.isInvested = true;
        updateData.investedAt = now;
        break;
    }

    await prisma.aIRecommendation.updateMany({
      where: { investorId, propertyId },
      data: updateData,
    });
  }

  // Get recommendation analytics
  static async getAnalytics(investorId: string) {
    const recommendations = await prisma.aIRecommendation.findMany({
      where: { investorId },
    });

    const total = recommendations.length;
    const viewed = recommendations.filter((r) => r.isViewed).length;
    const saved = recommendations.filter((r) => r.isSaved).length;
    const invested = recommendations.filter((r) => r.isInvested).length;
    const dismissed = recommendations.filter((r) => r.isDismissed).length;

    const conversionRate = total > 0 ? (invested / total) * 100 : 0;

    return {
      total,
      viewed,
      saved,
      invested,
      dismissed,
      conversionRate: Math.round(conversionRate * 10) / 10,
      engagementRate: total > 0 ? ((viewed + saved) / total) * 100 : 0,
    };
  }
}
