import fs from 'fs';
import path from 'path';
import { DatabaseSchema, BusinessConfig, CustomerProfile, StampActivity, CustomerReward } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_BUSINESS: BusinessConfig = {
  id: 'biz_kakinada_waffles',
  slug: 'kakinada-waffles',
  name: 'Kakinada Waffle Co.',
  tagline: 'Fresh Belgian & Bubble Waffles | Opposite JNTU-K',
  category: 'waffles',
  address: 'Shop #4, College Road, Near JNTU-K Main Gate, Kakinada',
  staffPin: '1234',
  instagramHandle: 'kakinadawaffleco',
  googleReviewUrl: 'https://maps.google.com/?q=JNTU-K+Kakinada',
  totalStampsRequired: 6,
  rewardTitle: 'Free Signature Nutella Waffle',
  rewardDescription: 'Enjoy a free freshly baked warm Nutella loaded waffle on your 6th visit!',
  scratchPrizes: [
    { id: 'p1', label: 'Free Extra Chocolate Dip', description: 'Add hot Belgian molten chocolate to any waffle', probability: 0.40, color: '#f59e0b' },
    { id: 'p2', label: '25% Off Your Next Order', description: 'Applicable on any signature waffle or shake', probability: 0.30, color: '#8b5cf6' },
    { id: 'p3', label: 'Free Cold Coffee', description: 'Chilled creamy cold coffee with chocolate drizzle', probability: 0.20, color: '#10b981' },
    { id: 'p4', label: 'JACKPOT: 2 Free Waffles', description: 'Any 2 classic waffles completely on the house!', probability: 0.10, color: '#ec4899' },
  ],
  menuItems: [
    { id: 'm1', name: 'Belgian Dark Chocolate Waffle', category: 'Waffles', price: 140, description: 'Crispy golden waffle smeared with warm melted dark chocolate', isPopular: true, emoji: '🧇' },
    { id: 'm2', name: 'Triple Chocolate Overload', category: 'Waffles', price: 170, description: 'White, milk, and dark chocolate layered with chocolate flakes', isPopular: true, emoji: '🍫' },
    { id: 'm3', name: 'Red Velvet White Wonder', category: 'Waffles', price: 160, description: 'Red velvet base with sweet melted white Belgian chocolate', emoji: '🍓' },
    { id: 'm4', name: 'Lotus Biscoff Crunch Waffle', category: 'Waffles', price: 180, description: 'Rich Biscoff spread topped with crushed caramelized cookies', isPopular: true, emoji: '🍪' },
    { id: 'm5', name: 'Oreo Cream Bubble Waffle', category: 'Bubble Waffles', price: 160, description: 'Fresh bubble waffle folded with vanilla cream and crushed Oreos', emoji: '🍨' },
    { id: 'm6', name: 'Iced Hazelnut Frappe', category: 'Beverages', price: 120, description: 'Thick espresso blended with hazelnut and creamy ice milk', emoji: '☕' },
    { id: 'm7', name: 'Belgian Thick Shake', category: 'Beverages', price: 130, description: 'Rich double chocolate ice cream milkshake', isPopular: true, emoji: '🥤' }
  ]
};

const INITIAL_CUSTOMERS: Record<string, CustomerProfile> = {
  '9876543210': {
    id: 'cust_demo_1',
    phone: '9876543210',
    name: 'Ani K.',
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastVisitAt: new Date().toISOString(),
    totalVisits: 5,
    currentStamps: 4,
    cardsCompleted: 0,
    hasFollowedInstagram: true,
    hasLeftGoogleReview: false,
    hasScratchedToday: false,
    lastScratchDate: undefined,
    unlockedRewards: [
      {
        id: 'rew_demo_scratch',
        rewardType: 'scratch_win',
        title: 'Free Extra Chocolate Dip',
        code: 'DIP482',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        redeemed: false
      }
    ]
  }
};

const INITIAL_ACTIVITIES: StampActivity[] = [
  {
    id: 'act_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customerPhone: '9876543210',
    customerName: 'Ani K.',
    action: 'stamp_added',
    details: 'Earned 1 stamp with order (Now 4/6 stamps)',
    stampsCount: 1
  }
];

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDatabase(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      business: INITIAL_BUSINESS,
      customers: INITIAL_CUSTOMERS,
      activities: INITIAL_ACTIVITIES
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading DB file, returning initial', err);
    return {
      business: INITIAL_BUSINESS,
      customers: INITIAL_CUSTOMERS,
      activities: INITIAL_ACTIVITIES
    };
  }
}

export function saveDatabase(db: DatabaseSchema): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export function getBusiness(): BusinessConfig {
  const db = getDatabase();
  return db.business;
}

export function updateBusiness(updated: Partial<BusinessConfig>): BusinessConfig {
  const db = getDatabase();
  db.business = { ...db.business, ...updated };
  saveDatabase(db);
  return db.business;
}

export function getCustomer(phone: string): CustomerProfile | null {
  const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
  const db = getDatabase();
  return db.customers[cleanPhone] || null;
}

export function upsertCustomer(phone: string, name?: string): CustomerProfile {
  const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
  const db = getDatabase();
  const today = new Date().toISOString().split('T')[0];

  let customer = db.customers[cleanPhone];
  if (!customer) {
    customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      phone: cleanPhone,
      name: name || `Customer ${cleanPhone.slice(-4)}`,
      joinedAt: new Date().toISOString(),
      lastVisitAt: new Date().toISOString(),
      totalVisits: 1,
      currentStamps: 1, // First visit bonus stamp!
      cardsCompleted: 0,
      hasFollowedInstagram: false,
      hasLeftGoogleReview: false,
      hasScratchedToday: false,
      unlockedRewards: []
    };
    db.activities.unshift({
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      customerPhone: cleanPhone,
      customerName: customer.name,
      action: 'stamp_added',
      details: 'Welcome bonus! 1st stamp credited upon joining.',
      stampsCount: 1
    });
  } else {
    if (name && name.trim()) {
      customer.name = name.trim();
    }
    // Check if scratch card can be reset today
    if (customer.lastScratchDate && customer.lastScratchDate !== today) {
      customer.hasScratchedToday = false;
    }
  }

  db.customers[cleanPhone] = customer;
  saveDatabase(db);
  return customer;
}

export function addStamps(phone: string, pin: string, count: number = 1): { success: boolean; message: string; customer?: CustomerProfile } {
  const db = getDatabase();
  if (pin !== db.business.staffPin) {
    return { success: false, message: 'Invalid Staff PIN. Please ask store staff to enter their PIN.' };
  }

  const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
  let customer = db.customers[cleanPhone];
  if (!customer) {
    customer = upsertCustomer(cleanPhone);
  }

  const required = db.business.totalStampsRequired;
  let newStamps = customer.currentStamps + count;
  let cardsEarned = 0;
  let rewardUnlocked: CustomerReward | null = null;

  if (newStamps >= required) {
    cardsEarned = Math.floor(newStamps / required);
    newStamps = newStamps % required;
    customer.cardsCompleted += cardsEarned;

    // Generate unlocked reward voucher
    const code = 'WAF' + Math.floor(1000 + Math.random() * 9000);
    rewardUnlocked = {
      id: `rew_${Date.now()}`,
      rewardType: 'stamp_milestone',
      title: db.business.rewardTitle,
      code,
      createdAt: new Date().toISOString(),
      redeemed: false
    };
    customer.unlockedRewards.unshift(rewardUnlocked);
  }

  customer.currentStamps = newStamps;
  customer.totalVisits += 1;
  customer.lastVisitAt = new Date().toISOString();

  // Log activity
  db.activities.unshift({
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
    customerPhone: cleanPhone,
    customerName: customer.name,
    action: rewardUnlocked ? 'reward_unlocked' : 'stamp_added',
    details: rewardUnlocked
      ? `Completed card! Unlocked: ${db.business.rewardTitle} (Voucher #${rewardUnlocked.code})`
      : `Staff credited +${count} stamp(s). Total: ${newStamps}/${required}`,
    stampsCount: count
  });

  db.customers[cleanPhone] = customer;
  saveDatabase(db);

  return {
    success: true,
    message: rewardUnlocked ? `Congratulations! You completed your stamp card and unlocked ${db.business.rewardTitle}!` : `Successfully added ${count} stamp(s)!`,
    customer
  };
}

export function claimSocialBonus(phone: string, type: 'instagram' | 'google_review'): { success: boolean; message: string; customer?: CustomerProfile } {
  const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
  const db = getDatabase();
  const customer = db.customers[cleanPhone];
  if (!customer) {
    return { success: false, message: 'Customer not found' };
  }

  if (type === 'instagram') {
    if (customer.hasFollowedInstagram) {
      return { success: false, message: 'Instagram bonus already claimed previously.' };
    }
    customer.hasFollowedInstagram = true;
  } else if (type === 'google_review') {
    if (customer.hasLeftGoogleReview) {
      return { success: false, message: 'Google Review bonus already claimed previously.' };
    }
    customer.hasLeftGoogleReview = true;
  }

  // Credit 1 bonus stamp
  const required = db.business.totalStampsRequired;
  customer.currentStamps += 1;
  if (customer.currentStamps >= required) {
    customer.cardsCompleted += 1;
    customer.currentStamps = customer.currentStamps - required;
    const code = 'SOC' + Math.floor(1000 + Math.random() * 9000);
    customer.unlockedRewards.unshift({
      id: `rew_${Date.now()}`,
      rewardType: 'stamp_milestone',
      title: db.business.rewardTitle,
      code,
      createdAt: new Date().toISOString(),
      redeemed: false
    });
  }

  db.activities.unshift({
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
    customerPhone: cleanPhone,
    customerName: customer.name,
    action: 'stamp_added',
    details: `Social bonus: Claimed 1 bonus stamp for ${type === 'instagram' ? 'Instagram follow' : 'Google review'}!`,
    stampsCount: 1
  });

  db.customers[cleanPhone] = customer;
  saveDatabase(db);
  return { success: true, message: 'Bonus stamp credited to your card!', customer };
}

export function performScratch(phone: string): { success: boolean; prize?: any; message: string; customer?: CustomerProfile } {
  const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
  const db = getDatabase();
  const customer = db.customers[cleanPhone];
  if (!customer) {
    return { success: false, message: 'Customer not found' };
  }

  const today = new Date().toISOString().split('T')[0];
  if (customer.lastScratchDate === today && customer.hasScratchedToday) {
    return { success: false, message: 'You have already played the scratch card today! Come back tomorrow.' };
  }

  // Pick prize based on probabilities
  const prizes = db.business.scratchPrizes;
  const rand = Math.random();
  let cumulative = 0;
  let selectedPrize = prizes[0];

  for (const p of prizes) {
    cumulative += p.probability;
    if (rand <= cumulative) {
      selectedPrize = p;
      break;
    }
  }

  // Create voucher
  const voucherCode = 'SCR' + Math.floor(1000 + Math.random() * 9000);
  const newReward: CustomerReward = {
    id: `rew_scratch_${Date.now()}`,
    rewardType: 'scratch_win',
    title: selectedPrize.label,
    code: voucherCode,
    createdAt: new Date().toISOString(),
    redeemed: false
  };

  customer.hasScratchedToday = true;
  customer.lastScratchDate = today;
  customer.unlockedRewards.unshift(newReward);

  db.activities.unshift({
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
    customerPhone: cleanPhone,
    customerName: customer.name,
    action: 'scratch_won',
    details: `Won scratch prize: ${selectedPrize.label} (Code: ${voucherCode})`
  });

  db.customers[cleanPhone] = customer;
  saveDatabase(db);

  return {
    success: true,
    prize: selectedPrize,
    message: `You won: ${selectedPrize.label}!`,
    customer
  };
}

export function redeemVoucher(phone: string, rewardId: string, pin: string): { success: boolean; message: string; customer?: CustomerProfile } {
  const db = getDatabase();
  if (pin !== db.business.staffPin) {
    return { success: false, message: 'Invalid Staff PIN. Only staff can confirm reward redemption.' };
  }

  const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
  const customer = db.customers[cleanPhone];
  if (!customer) {
    return { success: false, message: 'Customer not found' };
  }

  const reward = customer.unlockedRewards.find(r => r.id === rewardId || r.code === rewardId);
  if (!reward) {
    return { success: false, message: 'Voucher not found' };
  }

  if (reward.redeemed) {
    return { success: false, message: 'This voucher has already been redeemed on ' + new Date(reward.redeemedAt || '').toLocaleDateString() };
  }

  reward.redeemed = true;
  reward.redeemedAt = new Date().toISOString();

  db.activities.unshift({
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
    customerPhone: cleanPhone,
    customerName: customer.name,
    action: 'reward_redeemed',
    details: `Redeemed voucher #${reward.code}: ${reward.title}`
  });

  db.customers[cleanPhone] = customer;
  saveDatabase(db);

  return { success: true, message: `Successfully redeemed: ${reward.title}! Enjoy your treat.`, customer };
}

export function getStats() {
  const db = getDatabase();
  const customerList = Object.values(db.customers);
  const totalCustomers = customerList.length;
  const totalVisits = customerList.reduce((acc, c) => acc + c.totalVisits, 0);
  const totalCardsCompleted = customerList.reduce((acc, c) => acc + c.cardsCompleted, 0);

  let totalVouchersCreated = 0;
  let totalVouchersRedeemed = 0;
  customerList.forEach(c => {
    totalVouchersCreated += c.unlockedRewards.length;
    totalVouchersRedeemed += c.unlockedRewards.filter(r => r.redeemed).length;
  });

  const repeatCustomers = customerList.filter(c => c.totalVisits > 1).length;
  const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

  return {
    totalCustomers,
    totalVisits,
    repeatCustomers,
    repeatRate,
    totalCardsCompleted,
    totalVouchersCreated,
    totalVouchersRedeemed,
    activities: db.activities.slice(0, 20),
    customers: customerList
  };
}
