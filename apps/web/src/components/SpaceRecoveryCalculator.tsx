import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRight, Check, Sparkles, Home, Shield, RotateCcw, TrendingUp } from 'lucide-react';
import { formatInr } from '../lib/utils';
import { SmartLink } from './SmartLink';

interface DeclutterItem {
  id: string;
  name: string;
  category: string;
  sqFtSaved: number;
  cuFtVolume: number;
  monthlyStorageFee: number;
  typicalItems: string;
}

const ITEMS_CATALOG: DeclutterItem[] = [
  {
    id: 'winter_boxes',
    name: 'Winter Quilts & Festive Wear',
    category: 'Wardrobe',
    sqFtSaved: 8,
    cuFtVolume: 6,
    monthlyStorageFee: 398,
    typicalItems: '2 Double-ply heavy cartons with moisture packs'
  },
  {
    id: 'travel_suitcases',
    name: 'Luggage & Travel Trolleys',
    category: 'Luggage',
    sqFtSaved: 9,
    cuFtVolume: 6.5,
    monthlyStorageFee: 398,
    typicalItems: '2 Large 28" hard-shell suitcases + 1 duffel'
  },
  {
    id: 'wfh_furniture',
    name: 'Extra Desk & Ergonomic Chair',
    category: 'Furniture',
    sqFtSaved: 18,
    cuFtVolume: 14,
    monthlyStorageFee: 699,
    typicalItems: 'Engineered wood study desk + mesh chair'
  },
  {
    id: 'books_documents',
    name: 'Books, Tax Records & Albums',
    category: 'Archives',
    sqFtSaved: 6,
    cuFtVolume: 4.5,
    monthlyStorageFee: 299,
    typicalItems: '3 Heavy document boxes with tamper seal'
  },
  {
    id: 'fitness_bicycle',
    name: 'Road Bicycle & Sports Kit',
    category: 'Sports',
    sqFtSaved: 15,
    cuFtVolume: 12,
    monthlyStorageFee: 549,
    typicalItems: 'Hybrid cycle + yoga mats + cricket kit'
  },
  {
    id: 'baby_gear',
    name: 'Baby Crib, Stroller & Toys',
    category: 'Kids',
    sqFtSaved: 14,
    cuFtVolume: 10,
    monthlyStorageFee: 499,
    typicalItems: 'Disassembled wooden cot + pushchair'
  }
];

export function SpaceRecoveryCalculator() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['winter_boxes', 'travel_suitcases', 'wfh_furniture']);
  const [rentPerSqFt, setRentPerSqFt] = useState<number>(85);

  const [displaySqFt, setDisplaySqFt] = useState<number>(35);
  const [displayGain, setDisplayGain] = useState<number>(1480);

  const currSqFtRef = useRef(35);
  const currGainRef = useRef(1480);

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((item) => item !== id) : prev;
      }
      return [...prev, id];
    });
  };

  const stats = useMemo(() => {
    const selected = ITEMS_CATALOG.filter((i) => selectedIds.includes(i.id));
    const totalSqFt = selected.reduce((sum, item) => sum + item.sqFtSaved, 0);
    const totalCuFt = selected.reduce((sum, item) => sum + item.cuFtVolume, 0);
    const totalStorageCost = selected.reduce((sum, item) => sum + item.monthlyStorageFee, 0);
    const rentalValueRecovered = totalSqFt * rentPerSqFt;
    const netMonthlyGain = Math.max(0, rentalValueRecovered - totalStorageCost);

    return {
      totalSqFt,
      totalCuFt,
      totalStorageCost,
      rentalValueRecovered,
      netMonthlyGain,
      itemCount: selected.length
    };
  }, [selectedIds, rentPerSqFt]);

  // Finite rAF counter animation with reduced-motion snap
  useEffect(() => {
    const targetSqFt = stats.totalSqFt;
    const targetGain = stats.netMonthlyGain;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      currSqFtRef.current = targetSqFt;
      currGainRef.current = targetGain;
      setDisplaySqFt(targetSqFt);
      setDisplayGain(targetGain);
      return;
    }

    if (currSqFtRef.current === targetSqFt && currGainRef.current === targetGain) {
      return;
    }

    let rafId = 0;

    const tick = () => {
      const sqDiff = targetSqFt - currSqFtRef.current;
      const gainDiff = targetGain - currGainRef.current;

      if (sqDiff !== 0) {
        currSqFtRef.current += sqDiff > 0 ? Math.max(1, Math.ceil(sqDiff / 4)) : Math.min(-1, Math.floor(sqDiff / 4));
        setDisplaySqFt(currSqFtRef.current);
      }

      if (gainDiff !== 0) {
        currGainRef.current += gainDiff > 0 ? Math.max(1, Math.ceil(gainDiff / 4)) : Math.min(-1, Math.floor(gainDiff / 4));
        setDisplayGain(currGainRef.current);
      }

      if (currSqFtRef.current !== targetSqFt || currGainRef.current !== targetGain) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [stats.totalSqFt, stats.netMonthlyGain]);

  const areaRatio = Math.min(1, stats.totalSqFt / 65);
  const areaPercentage = Math.round(areaRatio * 100);

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-950/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Interactive Space Reclaimer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-white text-balance">
              Calculate the floor space and rent you get back
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl text-pretty">
              Tap items taking up dead space in your apartment. See your reclaimed square footage and monthly financial gain in real time.
            </p>
          </div>

          {/* Rent Rate Controls */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shrink-0">
            <div className="flex items-center justify-between text-xs mb-1.5 gap-4">
              <span className="text-slate-400">Your apartment rent rate:</span>
              <span className="font-mono text-emerald-400 font-medium tabular-nums">₹{rentPerSqFt}/sq ft /mo</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { rate: 60, label: '₹60 (Suburbs)' },
                { rate: 85, label: '₹85 (Metro avg)' },
                { rate: 120, label: '₹120 (Prime)' }
              ].map((opt) => (
                <button
                  key={opt.rate}
                  type="button"
                  aria-pressed={rentPerSqFt === opt.rate}
                  onClick={() => setRentPerSqFt(opt.rate)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors duration-200 ${
                    rentPerSqFt === opt.rate ? 'bg-slate-700 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Item Picker Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Select items taking up space in your flat:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ITEMS_CATALOG.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleItem(item.id)}
                  className={`text-left p-4 rounded-xl border transition-[transform,opacity,background-color,border-color] duration-200 flex flex-col justify-between active:scale-[0.98] ${
                    isSelected
                      ? 'bg-slate-800/90 border-lootup-500 shadow-md ring-1 ring-lootup-500/40 -translate-y-0.5'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                    <div
                      aria-hidden="true"
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-[transform,background-color] duration-200 ${
                        isSelected
                          ? 'bg-lootup-500 text-white scale-105'
                          : 'border border-slate-700 text-transparent scale-95'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="font-medium text-sm text-slate-100 mb-1 leading-snug">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mb-3 leading-relaxed">{item.typicalItems}</div>

                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 tabular-nums">+{item.sqFtSaved} sq ft saved</span>
                    <span className="text-slate-300 tabular-nums">₹{item.monthlyStorageFee}/mo</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live Calculation Output Card */}
        <div className="lg:col-span-5 bg-slate-950 rounded-xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-lootup-400" aria-hidden="true" />
              <span className="text-xs font-medium text-slate-300">Space Recovery Summary</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{stats.itemCount} categories selected</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">Total apartment floor space recovered</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-mono font-medium text-white tabular-nums tracking-tight">
                {displaySqFt}
              </span>
              <span className="text-lg font-mono text-emerald-400">sq ft</span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full w-full bg-gradient-to-r from-lootup-500 to-emerald-400 rounded-full origin-left transition-transform duration-300 ease-out"
                  style={{ transform: `scaleX(${areaRatio})` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>0 sq ft</span>
                <span className="text-emerald-400">{areaPercentage}% of typical bedroom freed</span>
                <span>65 sq ft</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Dead rent value unlocked:</span>
              <span className="font-mono text-emerald-400 font-medium tabular-nums">
                {formatInr(stats.rentalValueRecovered)} /mo
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Lootupspace secure vault storage:</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {formatInr(stats.totalStorageCost)} /mo
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Net monthly gain:</span>
                </div>
                <div className="text-[10px] text-emerald-300/90 font-mono">Rent saved minus storage cost</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-lg text-emerald-400 tabular-nums">
                  +{formatInr(displayGain)} /mo
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-lootup-400 shrink-0" aria-hidden="true" />
              <span>₹10,000 cover included</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-lootup-400 shrink-0" aria-hidden="true" />
              <span>Doorstep return anytime</span>
            </div>
          </div>

          <div className="pt-2">
            <SmartLink
              href="/customer/items/new"
              className="w-full bg-white hover:bg-slate-100 text-slate-950 py-3.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98] shadow-sm"
            >
              <span>Schedule pickup for {stats.itemCount} items</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </SmartLink>
            <div className="text-center text-[10px] text-slate-400 font-mono mt-2">
              Free 2-hour doorstep collection in Bengaluru, Mumbai, and Chennai
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
