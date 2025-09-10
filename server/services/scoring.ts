import { BusinessLead } from '@shared/schema';

export interface ScoreBreakdown {
  website: { value: number; weight: number; score: number };
  decisionMaker: { value: number; weight: number; score: number };
  social: { value: number; weight: number; score: number };
  reputation: { value: number; weight: number; score: number };
  sizeMatch: { value: number; weight: number; score: number };
}

export class LeadScoringService {
  private readonly weights = {
    website: 35,
    decisionMaker: 25,
    social: 15,
    reputation: 15,
    sizeMatch: 10,
  };

  calculateLeadScore(lead: Partial<BusinessLead>): { leadScore: number; scoreBreakdown: ScoreBreakdown } {
    const websiteScore = this.calculateWebsiteScore(lead.websiteStatus);
    const decisionMakerScore = this.calculateDecisionMakerScore(lead.ownerVerified || false, lead.ownerSources || []);
    const socialScore = this.calculateSocialScore(lead.recentPosts || undefined);
    const reputationScore = this.calculateReputationScore(lead.avgRating, lead.numReviews);
    const sizeMatchScore = this.calculateSizeMatchScore(lead.independentBusiness || false);

    const scoreBreakdown: ScoreBreakdown = {
      website: {
        value: websiteScore,
        weight: this.weights.website,
        score: websiteScore * this.weights.website,
      },
      decisionMaker: {
        value: decisionMakerScore,
        weight: this.weights.decisionMaker,
        score: decisionMakerScore * this.weights.decisionMaker,
      },
      social: {
        value: socialScore,
        weight: this.weights.social,
        score: socialScore * this.weights.social,
      },
      reputation: {
        value: reputationScore,
        weight: this.weights.reputation,
        score: reputationScore * this.weights.reputation,
      },
      sizeMatch: {
        value: sizeMatchScore,
        weight: this.weights.sizeMatch,
        score: sizeMatchScore * this.weights.sizeMatch,
      },
    };

    const leadScore = Math.round(
      scoreBreakdown.website.score +
      scoreBreakdown.decisionMaker.score +
      scoreBreakdown.social.score +
      scoreBreakdown.reputation.score +
      scoreBreakdown.sizeMatch.score
    );

    return { leadScore, scoreBreakdown };
  }

  private calculateWebsiteScore(websiteStatus?: string): number {
    switch (websiteStatus) {
      case 'NO_WEBSITE':
        return 1.0;
      case 'SOCIAL_ONLY':
        return 0.9;
      case 'OUTDATED_SITE':
        return 0.8;
      case 'MODERN_SITE':
        return 0.0; // We don't want businesses with modern sites
      default:
        return 0.5;
    }
  }

  private calculateDecisionMakerScore(ownerVerified?: boolean, ownerSources?: string[]): number {
    if (!ownerVerified) return 0.3;
    
    const sourceCount = ownerSources?.length || 0;
    if (sourceCount >= 2) return 1.0;
    if (sourceCount === 1) return 0.6;
    return 0.3;
  }

  private calculateSocialScore(recentPosts?: string): number {
    if (!recentPosts) return 0.2;
    
    const daysAgo = this.getDaysFromString(recentPosts);
    if (daysAgo <= 7) return 1.0;
    if (daysAgo <= 30) return 0.8;
    if (daysAgo <= 90) return 0.6;
    return 0.3;
  }

  private calculateReputationScore(avgRating?: number | null, numReviews?: number | null): number {
    if (!avgRating || !numReviews) return 0.4;
    
    let score = 0;
    
    // Rating component (0-0.6)
    if (avgRating >= 4.0) score += 0.6;
    else if (avgRating >= 3.5) score += 0.4;
    else if (avgRating >= 3.0) score += 0.2;
    
    // Review count component (0-0.4)
    if (numReviews >= 100) score += 0.4;
    else if (numReviews >= 50) score += 0.3;
    else if (numReviews >= 20) score += 0.2;
    else if (numReviews >= 5) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private calculateSizeMatchScore(independentBusiness?: boolean): number {
    return independentBusiness ? 1.0 : 0.0;
  }

  private getDaysFromString(dateString: string): number {
    // Parse strings like "3 days ago", "1 week ago", etc.
    const now = new Date();
    const match = dateString.match(/(\d+)\s+(day|week|month)s?\s+ago/);
    
    if (!match) return 999; // Default to very old
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'day':
        return value;
      case 'week':
        return value * 7;
      case 'month':
        return value * 30;
      default:
        return 999;
    }
  }

  calculateConfidence(lead: Partial<BusinessLead>): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence for verified owner
    if (lead.ownerVerified) confidence += 0.2;
    
    // Increase confidence for complete contact info
    if (lead.emailBusiness || lead.ownerContact) confidence += 0.15;
    
    // Increase confidence for recent social activity
    if (lead.recentPosts && this.getDaysFromString(lead.recentPosts) <= 30) {
      confidence += 0.1;
    }
    
    // Increase confidence for good reputation
    if (lead.avgRating && lead.avgRating >= 3.5) confidence += 0.05;
    
    return Math.min(Math.round(confidence * 100), 100);
  }
}
