import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { PRICING_CONFIG } from '@lootupspace/shared';
import { formatInr } from '../../lib/utils';
import { Shield, Lock, Eye, Thermometer } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-500">Facility standards</div>
          <h1 id="main-content" tabIndex={-1} className="text-3xl sm:text-4xl font-medium text-slate-950 tracking-tight text-balance">
            Safety, vault custody, and insurance
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed text-pretty">
            Physical perimeter security, climate management, and itemized insurance backing for personal belongings in metro hubs.
          </p>
        </div>

        {/* 4 Pillars of Protection */}
        <div id="climate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 scroll-mt-20">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center" aria-hidden="true">
              <Eye className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h2 className="font-medium text-slate-900 text-sm">24/7 CCTV surveillance</h2>
            <p className="text-slate-600 text-xs leading-relaxed text-pretty">
              Every aisle, rack, and perimeter point is recorded continuously with night vision and 90-day archive retention.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center" aria-hidden="true">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h2 className="font-medium text-slate-900 text-sm">Biometric restricted access</h2>
            <p className="text-slate-600 text-xs leading-relaxed text-pretty">
              Storage bays are closed to walk-in public access. Only background-verified warehouse officers access aisles.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center" aria-hidden="true">
              <Thermometer className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h2 className="font-medium text-slate-900 text-sm">Climate &amp; pest control</h2>
            <p className="text-slate-600 text-xs leading-relaxed text-pretty">
              Humidity regulation protects electronics, books, leather, and documents against moisture and dampness.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center" aria-hidden="true">
              <Shield className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h2 className="font-medium text-slate-900 text-sm">Transit &amp; vault insurance</h2>
            <p className="text-slate-600 text-xs leading-relaxed text-pretty">
              Complimentary ₹10,000 policy included for all active accounts, with optional coverage up to ₹1,00,000.
            </p>
          </div>
        </div>

        {/* Insurance Table */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-medium text-slate-900">Insurance coverage tiers</h2>
            <p className="text-xs text-slate-500">Underwritten for physical damage, theft, in-transit accidents, and water damage</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {PRICING_CONFIG.INSURANCE_TIERS.map((tier) => (
              <div key={tier.tierId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{tier.name}</div>
                  <div className="text-slate-500 font-mono text-[11px]">Maximum claim value: {formatInr(tier.coverageAmount)}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {tier.monthlyPrice === 0 ? 'Included free' : `${formatInr(tier.monthlyPrice)} / mo`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
