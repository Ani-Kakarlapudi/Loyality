'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { 
  Sparkles, 
  MapPin, 
  Utensils, 
  Gift, 
  CheckCircle2, 
  Phone, 
  User, 
  Lock, 
  ArrowRight,
  RefreshCw,
  QrCode,
  Tag,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import StampCard from '@/components/StampCard';
import ScratchCard from '@/components/ScratchCard';
import { BusinessConfig, CustomerProfile, CustomerReward } from '@/lib/types';

// Instagram icon component
function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function CustomerLoyaltyPage() {
  const params = useParams();
  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [phoneInput, setPhoneInput] = useState('9876543210');
  const [nameInput, setNameInput] = useState('Ani K.');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stamps' | 'scratch' | 'vouchers' | 'menu'>('stamps');

  // Staff PIN prompt modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffPin, setStaffPin] = useState('');
  const [stampCount, setStampCount] = useState(1);
  const [pinError, setPinError] = useState('');
  const [isSubmittingStamp, setIsSubmittingStamp] = useState(false);

  // Status banners / toasts
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch business config
  const fetchBusiness = useCallback(async () => {
    try {
      const res = await fetch('/api/business');
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch customer profile
  const fetchCustomer = useCallback(async (phone: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/customer?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
    fetchCustomer(phoneInput);
  }, [fetchBusiness, fetchCustomer]);

  // Handle customer login or quick join
  const handleJoinOrLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      setFeedbackMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number' });
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput, name: nameInput })
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setFeedbackMessage({ type: 'success', text: `Welcome to ${business?.name || 'the loyalty club'}!` });
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Staff stamps validation via PIN
  const handleStaffSubmitStamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setPinError('');
    setIsSubmittingStamp(true);

    try {
      const res = await fetch('/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customer.phone,
          pin: staffPin,
          count: stampCount
        })
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setShowStaffModal(false);
        setStaffPin('');
        setFeedbackMessage({ type: 'success', text: data.message });
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      } else {
        setPinError(data.message || 'Invalid Staff PIN. (Default is 1234)');
      }
    } catch (err: any) {
      setPinError(err.message);
    } finally {
      setIsSubmittingStamp(false);
    }
  };

  // Claim Social Booster
  const handleSocialClaim = async (type: 'instagram' | 'google_review') => {
    if (!customer) return;
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'social',
          phone: customer.phone,
          type
        })
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setFeedbackMessage({ type: 'success', text: data.message });
        confetti({ particleCount: 70, spread: 70 });
      } else {
        setFeedbackMessage({ type: 'error', text: data.message });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    }
  };

  // Scratch card reveal completion
  const handleScratchComplete = async () => {
    if (!customer) return;
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scratch',
          phone: customer.phone
        })
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setFeedbackMessage({ type: 'success', text: `Prize Claimed: ${data.prize?.label}!` });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-0 sm:py-6">
      {/* Mobile Device Frame for Authentic Experience */}
      <div className="w-full max-w-md bg-white sm:rounded-3xl shadow-2xl flex flex-col min-h-screen sm:min-h-[840px] sm:max-h-[900px] sm:border sm:border-slate-200 overflow-hidden relative">
        
        {/* Mobile Header / Brand Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white p-5 pt-6 relative shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold tracking-wide uppercase text-amber-100 mb-1">
                <Sparkles className="w-3 h-3 text-yellow-200" />
                <span>Official Loyalty Program</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
                {business?.name || 'Kakinada Waffle Co.'}
              </h1>
              <p className="text-xs text-amber-100 font-medium mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span className="truncate">{business?.address || 'Near JNTU-K College Main Gate'}</span>
              </p>
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🧇
            </div>
          </div>

          {/* Quick Customer Pill */}
          {customer && (
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white text-amber-700 font-bold flex items-center justify-center text-[11px]">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold">{customer.name}</span>
                  <span className="opacity-80 ml-1">({customer.phone})</span>
                </div>
              </div>
              <button
                onClick={() => setCustomer(null)}
                className="text-[11px] font-semibold text-amber-100 hover:text-white underline decoration-dotted"
              >
                Switch
              </button>
            </div>
          )}
        </div>

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-all ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} className="font-bold text-sm ml-2">×</button>
          </div>
        )}

        {/* Not Logged In / Phone Prompt */}
        {!customer && !isLoading && (
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
              <QrCode className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Welcome to Druto Loyalty</h2>
            <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
              Zero apps required. Just enter your phone number to collect stamps, win instant rewards, and get free waffles!
            </p>

            <form onSubmit={handleJoinOrLogin} className="w-full space-y-3">
              <div className="relative text-left">
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="relative text-left">
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ani K."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <span>Access Stamp Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Logged In Customer Tab Content */}
        {customer && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Tab Navigation */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('stamps')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === 'stamps' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Stamps
              </button>
              <button
                onClick={() => setActiveTab('scratch')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === 'scratch' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Scratch & Win
              </button>
              <button
                onClick={() => setActiveTab('vouchers')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition relative ${
                  activeTab === 'vouchers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Rewards
                {customer.unlockedRewards.filter(r => !r.redeemed).length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-full">
                    {customer.unlockedRewards.filter(r => !r.redeemed).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === 'menu' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Menu
              </button>
            </div>

            {/* TAB 1: DIGITAL STAMP CARD */}
            {activeTab === 'stamps' && (
              <div className="space-y-4">
                <StampCard
                  currentStamps={customer.currentStamps}
                  totalRequired={business?.totalStampsRequired || 6}
                  rewardTitle={business?.rewardTitle || 'Free Nutella Waffle'}
                  cardsCompleted={customer.cardsCompleted}
                  onStaffStampClick={() => setShowStaffModal(true)}
                />

                {/* Social Growth Boosters (Key Druto Feature) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Boost Your Stamp Progress</span>
                  </div>

                  {/* Instagram Follow Booster */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                        <InstagramIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Follow on Instagram</div>
                        <div className="text-[11px] text-pink-700 font-medium">+1 Free Bonus Stamp!</div>
                      </div>
                    </div>
                    {customer.hasFollowedInstagram ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSocialClaim('instagram')}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-rose-500 text-white text-xs font-bold rounded-lg shadow-xs hover:opacity-90 active:scale-95 transition"
                      >
                        Claim +1
                      </button>
                    )}
                  </div>

                  {/* Google Review Booster */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Leave Google Review</div>
                        <div className="text-[11px] text-blue-700 font-medium">+1 Free Bonus Stamp!</div>
                      </div>
                    </div>
                    {customer.hasLeftGoogleReview ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSocialClaim('google_review')}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs hover:bg-blue-700 active:scale-95 transition"
                      >
                        Claim +1
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SCRATCH & WIN */}
            {activeTab === 'scratch' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs text-center">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Daily In-Store Game</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Scratch & Win</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Rub the foil below with your finger or mouse to reveal today's surprise treat!
                  </p>

                  <ScratchCard
                    prizeText={customer.hasScratchedToday ? 'Prize Unlocked!' : 'Free Chocolate Dip / 25% Off'}
                    prizeDescription="Scratch the silver layer above to reveal your instant reward"
                    disabled={customer.hasScratchedToday}
                    onRevealed={handleScratchComplete}
                  />

                  {customer.hasScratchedToday && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                      Check your <strong>Rewards</strong> tab to view and redeem your voucher with the cashier.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: REWARDS & VOUCHERS WALLET */}
            {activeTab === 'vouchers' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Your Unlocked Rewards ({customer.unlockedRewards.length})
                  </h3>
                </div>

                {customer.unlockedRewards.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
                    <Gift className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold text-slate-600">No vouchers unlocked yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Collect stamps or play the scratch card to win rewards!</p>
                  </div>
                ) : (
                  customer.unlockedRewards.map((reward) => (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-2xl border relative overflow-hidden transition ${
                        reward.redeemed
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-amber-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            reward.rewardType === 'stamp_milestone'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {reward.rewardType === 'stamp_milestone' ? 'Stamp Card Reward' : 'Scratch Win'}
                          </span>
                          <h4 className="text-base font-black text-slate-900 mt-1">{reward.title}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Code: <span className="font-mono font-bold text-slate-800">{reward.code}</span>
                          </p>
                        </div>

                        {reward.redeemed ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Redeemed
                          </div>
                        ) : (
                          <div className="text-right">
                            <div className="text-[10px] text-amber-700 font-bold uppercase">Show to Cashier</div>
                            <div className="font-mono font-black text-base text-amber-600 tracking-wider">
                              #{reward.code}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: DIGITAL MENU */}
            {activeTab === 'menu' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Menu & Specials
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {business?.menuItems.map((item) => (
                    <div key={item.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shrink-0">
                          {item.emoji || '🧇'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{item.name}</span>
                            {item.isPopular && (
                              <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-1.5 py-0.2 rounded border border-rose-200">
                                HOT
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900">₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* STAFF PIN MODAL */}
        {showStaffModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-xs p-5 shadow-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-center text-slate-900">Staff Validation</h3>
              <p className="text-xs text-slate-500 text-center mt-0.5 mb-4">
                Store staff: Enter your 4-digit PIN to punch {stampCount} stamp(s).
              </p>

              <form onSubmit={handleStaffSubmitStamp} className="space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStampCount(num)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                        stampCount === num ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      +{num} {num === 1 ? 'Stamp' : 'Stamps'}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="password"
                    maxLength={4}
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    placeholder="Enter PIN (Default: 1234)"
                    className="w-full text-center tracking-widest text-lg font-black py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-[11px] font-bold text-rose-500 text-center mt-1.5">{pinError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowStaffModal(false); setStaffPin(''); setPinError(''); }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingStamp || staffPin.length < 4}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm disabled:opacity-50 transition"
                  >
                    {isSubmittingStamp ? 'Validating...' : 'Stamp Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
