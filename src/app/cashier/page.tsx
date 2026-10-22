'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Store, 
  Search, 
  Plus, 
  CheckCircle, 
  Gift, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomerProfile, BusinessConfig, StampActivity } from '@/lib/types';

export default function CashierPortal() {
  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [searchPhone, setSearchPhone] = useState('9876543210');
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [activities, setActivities] = useState<StampActivity[]>([]);
  const [pin, setPin] = useState('1234'); // Pre-filled default for quick cashier testing
  const [stampsToAdd, setStampsToAdd] = useState(1);
  const [redeemCode, setRedeemCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/standee');
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setActivities(data.stats.activities || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadData();
    searchCustomer(searchPhone);
  }, [loadData]);

  const searchCustomer = async (phone: string) => {
    if (!phone) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/customer?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
      } else {
        setCustomer(null);
        setMessage({ type: 'error', text: 'Customer not found. You can add them with the first stamp.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStamps = async () => {
    if (!searchPhone) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: searchPhone,
          pin,
          count: stampsToAdd
        })
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setMessage({ type: 'success', text: data.message });
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
        loadData();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemVoucher = async (rewardIdOrCode: string) => {
    if (!customer) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem',
          phone: customer.phone,
          rewardId: rewardIdOrCode,
          pin
        })
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setMessage({ type: 'success', text: data.message });
        confetti({ particleCount: 100, spread: 90 });
        loadData();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-3.5 h-3.5" />
            <span>Counter POS Terminal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cashier Stamp & Redemption Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {business?.name || 'Kakinada Waffle Co.'} · Store PIN Protected
          </p>
        </div>

        {/* Staff PIN setting indicator */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 px-3 rounded-2xl border border-slate-200 text-xs">
          <ShieldAlert className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-600">Active Staff PIN:</span>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-16 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Main Grid: Customer Lookup & Stamping vs Live Logs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: Fast Action Phone & Punch (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Phone Search Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <label className="text-xs font-black uppercase tracking-wider text-slate-600 block mb-2">
              Customer Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400">+91</span>
                <input
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={() => searchCustomer(searchPhone)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            {/* Notification message */}
            {message && (
              <div className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}
          </div>

          {/* Customer Profile & Stamp Punching */}
          {customer ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{customer.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{customer.phone} · {customer.totalVisits} visits total</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Current Progress</div>
                  <div className="text-xl font-black text-amber-600">
                    {customer.currentStamps} / {business?.totalStampsRequired || 6} <span className="text-xs font-bold text-slate-500">Stamps</span>
                  </div>
                </div>
              </div>

              {/* Fast Stamp Addition Box */}
              <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Award Stamps</div>
                <div className="flex items-center gap-3">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setStampsToAdd(n)}
                      className={`flex-1 py-2.5 rounded-xl font-black text-sm transition border ${
                        stampsToAdd === n
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      +{n} Stamp{n > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddStamps}
                  disabled={loading}
                  className="w-full mt-3 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Confirm & Credit +{stampsToAdd} Stamp{stampsToAdd > 1 ? 's' : ''} to Customer</span>
                </button>
              </div>

              {/* Vouchers Redemption Section */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                  Customer Rewards & Vouchers ({customer.unlockedRewards.length})
                </h4>

                {customer.unlockedRewards.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No vouchers available for redemption.</p>
                ) : (
                  <div className="space-y-2">
                    {customer.unlockedRewards.map((rew) => (
                      <div
                        key={rew.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                          rew.redeemed
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-emerald-50/40 border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Gift className={`w-5 h-5 ${rew.redeemed ? 'text-slate-400' : 'text-emerald-600'}`} />
                          <div>
                            <div className="text-xs font-black text-slate-900">{rew.title}</div>
                            <div className="text-[11px] text-slate-500 font-mono">Voucher Code: #{rew.code}</div>
                          </div>
                        </div>

                        {rew.redeemed ? (
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                            Redeemed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRedeemVoucher(rew.id)}
                            disabled={loading}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition"
                          >
                            Redeem Now
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Prompt to auto-create when searched number doesn't exist */
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
              <Smartphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Ready to Enroll or Punch Customer</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Enter any 10-digit number above to lookup existing visits, or punch their first stamp to create their digital pass.
              </p>
              <button
                onClick={handleAddStamps}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                + Create & Award First Stamp to {searchPhone}
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Live Counter Activity Feed (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Live Counter Activity</h3>
              </div>
              <button
                onClick={loadData}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No recent activity.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{act.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{act.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
