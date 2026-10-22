import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Smartphone, Store, ShieldCheck, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Druto Loyalty Engine | Zero-App Digital Stamp & Retention Platform',
  description: 'Replication of Druto.in: App-free QR digital stamp cards, scratch-to-win rewards, Instagram boosters, and merchant standee generator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Top universal navigation bar for switching views */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight leading-none group-hover:text-indigo-600 transition">
                  DRUTO <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-1.5 py-0.5 rounded ml-0.5">REPLICA</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">QR Loyalty & Retention</span>
              </div>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/c/kakinada-waffles"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                <Smartphone className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">Customer</span> Mobile
              </Link>

              <Link
                href="/cashier"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600 transition"
              >
                <Store className="w-4 h-4 text-emerald-500" />
                <span>Cashier</span> Counter
              </Link>

              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-amber-600 transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin</span> CRM
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 print:hidden">
          <p>© 2026 Druto Architecture Replication · Engineered for Kakinada Waffle Co. & Local Merchants</p>
        </footer>
      </body>
    </html>
  );
}
