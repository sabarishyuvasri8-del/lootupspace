'use client';

import React, { useState, useMemo, useId } from 'react';
import { SizeTier, DimensionUnit, calculateStoragePrice, calculateCubicFeet, determineSizeTier, DEFAULT_PRICING_TIERS } from '@lootupspace/shared';
import { formatInr } from '../lib/utils';
import { Check, ArrowRight } from 'lucide-react';
import { SmartLink } from './SmartLink';

export function PricingCalculator({ showCta = true }: { showCta?: boolean; onSelectPlan?: (result: any) => void }) {
  const [mode, setMode] = useState<'STANDARD' | 'CUSTOM'>('STANDARD');
  const [selectedTier, setSelectedTier] = useState<SizeTier>(SizeTier.MEDIUM_BOX);
  const [quantity, setQuantity] = useState<number>(2);

  const [length, setLength] = useState<number>(60);
  const [width, setWidth] = useState<number>(45);
  const [height, setHeight] = useState<number>(40);
  const [unit, setUnit] = useState<DimensionUnit>(DimensionUnit.CM);

  const [commitmentMonths, setCommitmentMonths] = useState<3 | 6 | 12>(6);
  const [packingNeeded, setPackingNeeded] = useState<boolean>(false);
  const [materialsNeeded, setMaterialsNeeded] = useState<boolean>(false);
  const [priorityPickup, setPriorityPickup] = useState<boolean>(false);
  const [insuranceTier] = useState<string>('BASIC');
  const [coupon] = useState<string>('WELCOME100');

  const lengthId = useId();
  const widthId = useId();
  const heightId = useId();

  const customCubicFeet = useMemo(() => {
    return calculateCubicFeet(length, width, height, unit);
  }, [length, width, height, unit]);

  const recommendedTier = useMemo(() => {
    return determineSizeTier(customCubicFeet);
  }, [customCubicFeet]);

  const pricingResult = useMemo(() => {
    const items = mode === 'STANDARD'
      ? [{ sizeTier: selectedTier, quantity, packingRequired: packingNeeded, materialsRequired: materialsNeeded }]
      : [{ length, width, height, unit, quantity, packingRequired: packingNeeded, materialsRequired: materialsNeeded }];

    return calculateStoragePrice({
      items,
      commitmentMonths,
      priorityPickup,
      insuranceTierId: insuranceTier,
      couponCode: coupon
    });
  }, [mode, selectedTier, quantity, length, width, height, unit, commitmentMonths, packingNeeded, materialsNeeded, priorityPickup, insuranceTier, coupon]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher */}
          <div>
            <div className="text-xs font-medium text-slate-700 mb-2">Calculation method</div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                aria-pressed={mode === 'STANDARD'}
                onClick={() => setMode('STANDARD')}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-150 ${
                  mode === 'STANDARD'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standard box tiers
              </button>
              <button
                type="button"
                aria-pressed={mode === 'CUSTOM'}
                onClick={() => setMode('CUSTOM')}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-150 ${
                  mode === 'CUSTOM'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom dimensions (L × W × H)
              </button>
            </div>
          </div>

          {mode === 'STANDARD' ? (
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-700">Storage size tier</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(DEFAULT_PRICING_TIERS).filter(([k]) => k !== SizeTier.CUSTOM).map(([tierKey, tier]) => {
                  const isSelected = selectedTier === tierKey;
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedTier(tierKey as SizeTier)}
                      className={`text-left p-3.5 rounded-lg border transition-colors duration-150 relative ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center" aria-hidden="true">
                          <Check className="w-2.5 h-2.5" strokeWidth={2} />
                        </span>
                      )}
                      <div className="font-medium text-slate-900 text-sm pr-5">{tier.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tier.description}</div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-base font-semibold text-slate-900 tabular-nums">{formatInr(tier.monthlyRateInr)}</span>
                        <span className="text-xs text-slate-500">per month</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">
                        Up to {tier.maxCubicFeet} cu ft ({tier.dimensionsGuide})
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <span className="text-xs font-medium text-slate-700">Number of items or boxes</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-mono text-xs tabular-nums text-slate-900" aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Unit</span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 text-xs">
                  {(['CM', 'INCH', 'FT'] as DimensionUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      aria-pressed={unit === u}
                      onClick={() => setUnit(u)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${unit === u ? 'bg-slate-900 text-white font-medium' : 'text-slate-600'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor={lengthId} className="block text-xs text-slate-600 mb-1">Length ({unit})</label>
                  <input
                    id={lengthId}
                    type="number"
                    min={1}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs text-slate-900 bg-white font-mono"
                  />
                </div>
                <div>
                  <label htmlFor={widthId} className="block text-xs text-slate-600 mb-1">Width ({unit})</label>
                  <input
                    id={widthId}
                    type="number"
                    min={1}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs text-slate-900 bg-white font-mono"
                  />
                </div>
                <div>
                  <label htmlFor={heightId} className="block text-xs text-slate-600 mb-1">Height ({unit})</label>
                  <input
                    id={heightId}
                    type="number"
                    min={1}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs text-slate-900 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Calculated volume</span>
                  <div className="text-sm font-mono font-medium text-slate-900 tabular-nums">{customCubicFeet} cu ft</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Mapped tier</span>
                  <div className="text-xs font-medium text-slate-800">
                    {DEFAULT_PRICING_TIERS[recommendedTier].name}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Commitment Period */}
          <div>
            <div className="text-xs font-medium text-slate-700 mb-2">Commitment plan</div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { months: 3, discount: '0% discount', tag: 'Standard' },
                { months: 6, discount: '5% discount', tag: 'Recommended' },
                { months: 12, discount: '10% discount', tag: 'Annual' }
              ].map((opt) => {
                const isSelected = commitmentMonths === opt.months;
                return (
                  <button
                    key={opt.months}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setCommitmentMonths(opt.months as 3 | 6 | 12)}
                    className={`p-3 rounded-lg border text-center transition-colors duration-150 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-medium text-slate-900">{opt.months} months</div>
                    <div className="text-[11px] text-emerald-700 font-mono mt-0.5">{opt.discount}</div>
                    <span className="inline-block text-[10px] text-slate-500 mt-1 font-mono">
                      {opt.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doorstep Add-ons */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Optional services</div>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={packingNeeded}
                    onChange={(e) => setPackingNeeded(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900"
                  />
                  <div>
                    <div className="text-xs font-medium text-slate-900">Professional packing</div>
                    <div className="text-[11px] text-slate-500">Trained crew packs fragile items safely</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-800">+₹249/item</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={materialsNeeded}
                    onChange={(e) => setMaterialsNeeded(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900"
                  />
                  <div>
                    <div className="text-xs font-medium text-slate-900">Packing materials kit</div>
                    <div className="text-[11px] text-slate-500">5-ply cartons, bubble wrap, tamper tape</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-800">+₹99/item</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={priorityPickup}
                    onChange={(e) => setPriorityPickup(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900"
                  />
                  <div>
                    <div className="text-xs font-medium text-slate-900">Priority 3-hour window</div>
                    <div className="text-[11px] text-slate-500">Guaranteed collection within 3 hours</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-800">+₹199</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-900">Storage breakdown</span>
              <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                18% GST itemized
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Monthly storage subtotal</span>
                <span className="font-mono text-slate-900 tabular-nums">{formatInr(pricingResult.monthlyStorageSubtotal)}</span>
              </div>

              {pricingResult.commitmentDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Commitment discount ({pricingResult.commitmentDiscountPercent}%)</span>
                  <span className="font-mono tabular-nums">-{formatInr(pricingResult.commitmentDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Discounted monthly storage</span>
                <span className="font-mono text-slate-900 tabular-nums">{formatInr(pricingResult.discountedMonthlyStorage)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Insurance (₹10,000 cover)</span>
                <span className="font-mono text-emerald-700">Included</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="text-[11px] font-medium text-slate-500">Doorstep trip charges</div>
              <div className="flex justify-between text-slate-600">
                <span>Collection &amp; loading</span>
                <span className="font-mono text-slate-900 tabular-nums">{formatInr(pricingResult.pickupFee)}</span>
              </div>

              {pricingResult.packingServiceFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Packing service</span>
                  <span className="font-mono text-slate-900 tabular-nums">{formatInr(pricingResult.packingServiceFee)}</span>
                </div>
              )}

              {pricingResult.packingMaterialsFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Packing materials</span>
                  <span className="font-mono text-slate-900 tabular-nums">{formatInr(pricingResult.packingMaterialsFee)}</span>
                </div>
              )}

              {pricingResult.couponDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo discount (WELCOME100)</span>
                  <span className="font-mono tabular-nums">-{formatInr(pricingResult.couponDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                <span>Applicable GST (18%)</span>
                <span className="font-mono tabular-nums">{formatInr(pricingResult.oneTimeGst + pricingResult.monthlyRecurringGst)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-900">Total due today</div>
                  <div className="text-[11px] text-slate-500">1st month storage + collection + taxes</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-medium text-slate-950 tabular-nums">{formatInr(pricingResult.totalDueToday)}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Recurring monthly:</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">{formatInr(pricingResult.monthlyRecurringTotal)} / mo</span>
              </div>
            </div>
          </div>

          {showCta && (
            <div className="pt-6">
              <SmartLink
                href="/customer/items/new"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors duration-150 active:scale-[0.98]"
              >
                <span>Store items with this rate</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              </SmartLink>
              <div className="text-[11px] text-center text-slate-500 mt-2 font-mono">
                Free cancellation up to 4 hours before pickup
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
