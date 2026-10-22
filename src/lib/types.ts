export interface BusinessConfig {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: 'cafe' | 'waffles' | 'salon' | 'restaurant' | 'retail';
  address: string;
  staffPin: string; // 4-digit PIN for staff validation
  instagramHandle: string;
  googleReviewUrl: string;
  totalStampsRequired: number; // e.g., 6 or 8
  rewardTitle: string; // e.g., "Free Belgian Chocolate Waffle" or "Free Cappuccino"
  rewardDescription: string;
  scratchPrizes: Array<{
    id: string;
    label: string;
    description: string;
    probability: number;
    color: string;
  }>;
  menuItems: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    isPopular?: boolean;
    emoji?: string;
  }>;
}

export interface CustomerReward {
  id: string;
  rewardType: 'stamp_milestone' | 'scratch_win' | 'social_bonus';
  title: string;
  code: string; // 6-digit redemption code
  createdAt: string;
  redeemed: boolean;
  redeemedAt?: string;
}

export interface CustomerProfile {
  id: string;
  phone: string;
  name: string;
  joinedAt: string;
  lastVisitAt: string;
  totalVisits: number;
  currentStamps: number; // 0 to totalStampsRequired
  cardsCompleted: number;
  hasFollowedInstagram: boolean;
  hasLeftGoogleReview: boolean;
  hasScratchedToday: boolean;
  lastScratchDate?: string;
  unlockedRewards: CustomerReward[];
}

export interface StampActivity {
  id: string;
  timestamp: string;
  customerPhone: string;
  customerName: string;
  action: 'stamp_added' | 'reward_unlocked' | 'reward_redeemed' | 'scratch_won';
  details: string;
  stampsCount?: number;
}

export interface DatabaseSchema {
  business: BusinessConfig;
  customers: Record<string, CustomerProfile>; // keyed by phone
  activities: StampActivity[];
}
