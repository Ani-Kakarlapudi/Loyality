'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Repeat, 
  Award, 
  Gift, 
  Printer, 
  Settings, 
  QrCode, 
  Search, 
  ExternalLink,
  Save,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { BusinessConfig, CustomerProfile } from '@/lib/types';

export default function AdminDashboard() {
  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [customerUrl, setCustomerUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'crm' | 'standee' | 'settings'>('analytics');
  const [searchFilter, setSearchFilter] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings form state
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStamps, setFormStamps] = useState(6);
  const [formRewardTitle, setFormRewardTitle] = useState('');
  const [formStaffPin, setFormStaffPin] = useState('1234');

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/standee');
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setStats(data.stats);
        setQrDataUrl(data.qrDataUrl);
        setCustomerUrl(data.customerUrl);

        // Prepopulate settings form
        setFormName(data.business.name);
        setFormTagline(data.business.tagline);
        setFormAddress(data.business.address);
        setFormStamps(data.business.totalStampsRequired);
        setFormRewardTitle(data.business.rewardTitle);
        setFormStaffPin(data.business.staffPin);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          tagline: formTagline,
          address: formAddress,
          totalStampsRequired: Number(formStamps),
          rewardTitle: formRewardTitle,
          staffPin: formStaffPin
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredCustomers = (stats?.customers || []).filter((c: CustomerProfile) => {
    return c.phone.includes(searchFilter) || c.name.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merchant Retention Cloud</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin & CRM Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {business?.name || 'Kakinada Waffle Co.'} · Turn first-time visitors into loyal regulars
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'crm' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer CRM
          </button>
          <button
            onClick={() => setActiveTab('standee')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'standee' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            QR Standee
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Customers</div>
                  <div className="text-2xl font-black text-slate-900">{stats.totalCustomers}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Repeat Visit Rate</div>
                  <div className="text-2xl font-black text-emerald-600">{stats.repeatRate}%</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Cards</div>
                  <div className="text-2xl font-black text-amber-600">{stats.totalCardsCompleted}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Redeemed Vouchers</div>
                  <div className="text-2xl font-black text-rose-600">{stats.totalVouchersRedeemed}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Retention Impact Explainer */}
          <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl p-6 text-white shadow-md">
            <h3 className="text-lg font-black">Why This Engine Beats Paper Punch Cards</h3>
            <p className="text-xs text-white/90 mt-1 max-w-2xl leading-relaxed">
              Customers lose 80% of physical stamp cards. With this zero-app digital QR pass, customers carry their card inside their mobile browser. Each visit captures their phone number, unlocks automated scratch-to-win games, and prompts immediate Instagram followers and Google reviews.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER CRM */}
      {activeTab === 'crm' && stats && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search name or phone..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs font-bold text-slate-500">
              Showing {filteredCustomers.length} of {stats.totalCustomers} customers
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-black uppercase text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Visits</th>
                  <th className="py-3.5 px-4">Stamps Progress</th>
                  <th className="py-3.5 px-4">Rewards Unlocked</th>
                  <th className="py-3.5 px-4">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">No customers found matching filter.</td>
                  </tr>
                ) : (
                  filteredCustomers.map((c: CustomerProfile) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">{c.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[11px]">
                          {c.totalVisits} visits
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-600">{c.currentStamps}/{business?.totalStampsRequired || 6}</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${(c.currentStamps / (business?.totalStampsRequired || 6)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {c.unlockedRewards.length} ({c.unlockedRewards.filter(r => r.redeemed).length} redeemed)
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(c.lastVisitAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QR STANDEE GENERATOR */}
      {activeTab === 'standee' && (
        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Counter QR Standee Generator</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Print this high-resolution counter display card to place right beside your cash register or on dining tables.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Printer className="w-4 h-4" /> Print Counter Standee
            </button>
          </div>

          {/* Printable Standee Display Card */}
          <div className="flex justify-center">
            <div
              id="printable-standee"
              className="w-full max-w-sm bg-white rounded-3xl p-8 border-4 border-amber-400 shadow-2xl text-center space-y-5"
            >
              {/* Standee Header */}
              <div>
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                  ✨ Collect Digital Stamps
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {business?.name || 'Kakinada Waffle Co.'}
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  {business?.tagline || 'Opposite JNTU-K College Main Gate'}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-300 inline-block shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Standee Loyalty QR Code"
                    className="w-56 h-56 mx-auto rounded-xl shadow-xs"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-300">
                    <QrCode className="w-16 h-16 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Incentive Callout */}
              <div className="bg-amber-500 text-white p-3.5 rounded-2xl shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Special Offer</div>
                <div className="text-base font-black leading-tight mt-0.5">
                  Scan & Get 1st Stamp Free + {business?.rewardTitle || 'Free Waffle'} on 6th Visit!
                </div>
              </div>

              {/* Easy Steps */}
              <div className="grid grid-cols-3 gap-2 text-left pt-2 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-amber-500 font-black text-sm">1. Scan</div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">With phone camera</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-500 font-black text-sm">2. Punch</div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">Collect digital stamps</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-500 font-black text-sm">3. Win</div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">Claim free rewards!</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold">
                No app installation required · Works on any smartphone
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-2xl mt-6">
          <h3 className="text-base font-black text-slate-900 mb-1">Loyalty Program Configuration</h3>
          <p className="text-xs text-slate-500 mb-5">
            Customize your store branding, stamps requirement, milestone reward, and counter staff PIN.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Business Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={formTagline}
                onChange={(e) => setFormTagline(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Store Address</label>
              <input
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Stamps for Free Reward</label>
                <input
                  type="number"
                  min={3}
                  max={12}
                  value={formStamps}
                  onChange={(e) => setFormStamps(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Staff PIN (Counter Security)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={formStaffPin}
                  onChange={(e) => setFormStaffPin(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Milestone Reward Title</label>
              <input
                type="text"
                value={formRewardTitle}
                onChange={(e) => setFormRewardTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Changes saved successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={savingSettings}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
