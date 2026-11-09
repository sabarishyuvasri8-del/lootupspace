'use client';

import React, { useState, useId } from 'react';
import { DEFAULT_PRICING_TIERS, PRICING_CONFIG, SizeTier } from '@lootupspace/shared';
import { CheckCircle2, Save } from 'lucide-react';

export default function AdminPricingRulesPage() {
  const [tiers, setTiers] = useState(DEFAULT_PRICING_TIERS);
  const [basePickupFee, setBasePickupFee] = useState(PRICING_CONFIG.BASE_PICKUP_FEE);
  const [perKmFee, setPerKmFee] = useState(PRICING_CONFIG.PER_KM_FEE_BEYOND_BASE);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const baseFeeId = useId();
  const perKmFeeId = useId();

  const handleUpdateTierRate = (tierKey: SizeTier, newRate: number) => {
    setTiers({
      ...tiers,
      [tierKey]: {
        ...tiers[tierKey],
        monthlyRateInr: newRate
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400">Revenue Architecture</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Pricing Engine Rules & Rate Configuration
          </h1>
          <p className="text-xs text-slate-400">
            Dynamically configure size tier monthly rates, round-trip transportation charges, and commitment discounts.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors duration-150"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>Save Changes to Engine</span>
        </button>
      </div>

      {savedSuccess && (
        <div role="status" aria-live="polite" className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Pricing rules saved and deployed across Mumbai, Bengaluru, and Chennai hubs!</span>
        </div>
      )}

      {/* Size Tiers Table */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-white text-base">Standard Size Storage Tiers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(tiers).map(([tierKey, tier]) => {
            const inputId = `rate-${tierKey}`;
            return (
              <div key={tierKey} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-sm">{tier.name}</h3>
                    <p className="text-[11px] text-slate-400">{tier.description}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    Max: {tier.maxCubicFeet} cu ft
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label htmlFor={inputId} className="text-xs text-slate-300 font-semibold">Monthly Rate (₹):</label>
                  <input
                    id={inputId}
                    type="number"
                    value={tier.monthlyRateInr}
                    onChange={(e) => handleUpdateTierRate(tierKey as SizeTier, Number(e.target.value))}
                    className="w-32 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:outline-2 focus:outline-transparent"
                  />
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transportation & Addon Rules */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-white text-base">Transportation & Distance Surcharges</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label htmlFor={baseFeeId} className="text-slate-400 block font-semibold">Base Doorstep Pickup Fee</label>
            <input
              id={baseFeeId}
              type="number"
              value={basePickupFee}
              onChange={(e) => setBasePickupFee(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:outline-2 focus:outline-transparent"
            />
            <span className="text-[10px] text-slate-500">Includes first 5 km & 5 boxes</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label htmlFor={perKmFeeId} className="text-slate-400 block font-semibold">Per KM Fee Beyond Base 5 KM</label>
            <input
              id={perKmFeeId}
              type="number"
              value={perKmFee}
              onChange={(e) => setPerKmFee(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:outline-2 focus:outline-transparent"
            />
            <span className="text-[10px] text-slate-500">Auto-calculated via Google Maps distance</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-semibold">Early Exit Penalty</span>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-700 font-bold text-white">
              1 Month&apos;s Storage Charge
            </div>
            <span className="text-[10px] text-slate-500">For exits prior to commitment</span>
          </div>
        </div>
      </div>
    </form>
  );
}

