'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Gift, 
  Repeat, 
  Award,
  Zap,
  Users
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/standee')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white py-16 px-4 text-center relative overflow-hidden">
        {/* Glowing backdrop elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold uppercase tracking-wider text-amber-300 shadow-inner">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Exact Druto.in Software Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Turn First-Time Walk-ins Into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
              Obsessed Regulars
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Zero app downloads. Customers scan your counter QR standee to collect digital stamps, scratch daily surprise rewards, and follow your Instagram — while your cashier punches stamps securely with a 4-digit PIN.
          </p>

          {/* Quick Action Cards / Switchers */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            
            {/* Customer view */}
            <Link
              href="/c/kakinada-waffles"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white group-hover:text-amber-400 transition">Customer View</h3>
                <p className="text-xs text-slate-300 mt-1">Mobile QR pass, interactive scratch card & vouchers.</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-amber-400 gap-1 group-hover:translate-x-1 transition">
                <span>Test as Customer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Cashier view */}
            <Link
              href="/cashier"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mb-3">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white group-hover:text-emerald-400 transition">Cashier POS Desk</h3>
                <p className="text-xs text-slate-300 mt-1">Punch stamps via phone number, verify PIN & redeem.</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition">
                <span>Open Counter View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Admin CRM */}
            <Link
              href="/admin"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white group-hover:text-indigo-400 transition">Merchant Admin</h3>
                <p className="text-xs text-slate-300 mt-1">Retention analytics, customer CRM & printable standee.</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-indigo-400 gap-1 group-hover:translate-x-1 transition">
                <span>Launch Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Feature Breakdown Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 w-full space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How The 4 Core Engines Work Together
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Everything shown in the viral Instagram reel, engineered into a lightning-fast web application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">1. Instant QR Onboarding</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Zero App Store downloads. Customers scan table or counter standee QR codes and are instantly inside their loyalty card in under 2 seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">2. Scratch & Win Games</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Daily interactive HTML5 scratch canvas game where customers wipe silver coating to reveal instant discounts, free dips, or drinks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">3. Social Booster Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Incentivize real foot-traffic customers to follow the store's Instagram page or write a Google Review for immediate bonus stamps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">4. Staff PIN Security</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Prevents customer self-stamping fraud. Only store staff can punch stamps or redeem unlocked gifts using a quick 4-digit PIN.
            </p>
          </div>
        </div>

        {/* Live Platform Stats Pill */}
        {stats && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-around gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-indigo-600">{stats.totalCustomers}</div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mt-0.5">Enrolled Customers</div>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-2xl font-black text-amber-500">{stats.totalVisits}</div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mt-0.5">Store Visits Recorded</div>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-2xl font-black text-emerald-600">{stats.repeatRate}%</div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mt-0.5">Repeat Retention Rate</div>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-2xl font-black text-rose-500">{stats.totalVouchersRedeemed}</div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mt-0.5">Rewards Redeemed</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
