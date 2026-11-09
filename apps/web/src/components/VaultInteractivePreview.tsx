import React, { useState, useId, useRef } from 'react';
import { Package, Shield, Truck, QrCode, CheckCircle2, Thermometer, ArrowUpRight, MapPin } from 'lucide-react';
import { SmartLink } from './SmartLink';

type VaultTab = 'INVENTORY' | 'TRACKING' | 'SECURITY';

const TABS: Array<{ id: VaultTab; label: string }> = [
  { id: 'INVENTORY', label: 'Digital Vault' },
  { id: 'TRACKING', label: 'Live Tracking' },
  { id: 'SECURITY', label: 'Tamper Seal' }
];

export function VaultInteractivePreview() {
  const [activeTab, setActiveTab] = useState<VaultTab>('INVENTORY');
  const [returnRequestedId, setReturnRequestedId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleRequestReturn = (id: string) => {
    if (returnRequestedId === id) {
      setReturnRequestedId(null);
      setShowToast(false);
    } else {
      setReturnRequestedId(id);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 4500);
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    let nextIndex = -1;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = TABS.length - 1;

    if (nextIndex !== -1) {
      e.preventDefault();
      setActiveTab(TABS[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-colors duration-300 hover:border-slate-700/80">
      {/* Top Status Header */}
      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute animate-ping opacity-75"></span>
          </div>
          <span className="text-xs font-medium text-slate-200">Indiranagar Vault BLR-01</span>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Thermometer className="w-3.5 h-3.5 text-lootup-400" aria-hidden="true" />
            <span>22.6°C · 48% RH</span>
          </div>
        </div>

        {/* Accessible WAI-ARIA Tab Switcher */}
        <div
          role="tablist"
          aria-label="Vault preview modes"
          onKeyDown={handleTabKeyDown}
          className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]"
        >
          {TABS.map((tab, idx) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                  isSelected
                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live region toast */}
      <div aria-live="polite">
        {showToast && (
          <div className="px-5 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 animate-fade-in-down">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Doorstep return scheduled! Dispatching from Indiranagar Hub.</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-300">Slot: Tomorrow 10 AM</span>
          </div>
        )}
      </div>

      {/* Tab 1: Digital Vault Inventory View */}
      {activeTab === 'INVENTORY' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-INVENTORY`}
          aria-labelledby={`${baseId}-tab-INVENTORY`}
          tabIndex={0}
          className="p-5 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
            <div>
              <div className="font-medium text-slate-200">Aarav&apos;s Personal Vault (#VLT-8819)</div>
              <div className="text-[11px] text-slate-400 font-mono">3 items held · Next renewal Dec 01</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Insured (₹10,000)
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Item 1 */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/90 hover:-translate-y-0.5 transition-[transform,background-color,border-color] duration-200 flex items-center justify-between gap-3 text-xs group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 overflow-hidden shrink-0 border border-slate-600/50 group-hover:border-lootup-500/50 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80"
                    alt="Packed winter woolens carton"
                    width={40}
                    height={40}
                    decoding="async"
                    {...({ fetchPriority: 'high' } as any)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    Winter Woolens &amp; Silk Quilts
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Rack 03 · Bin B-14 · 2.5 cu ft</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono text-slate-300 tabular-nums">₹199/mo</span>
                <button
                  type="button"
                  aria-pressed={returnRequestedId === 'item_1'}
                  onClick={() => handleRequestReturn('item_1')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-200 active:scale-[0.96] ${
                    returnRequestedId === 'item_1'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {returnRequestedId === 'item_1' ? 'Return queued' : 'Request return'}
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/90 hover:-translate-y-0.5 transition-[transform,background-color,border-color] duration-200 flex items-center justify-between gap-3 text-xs group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 overflow-hidden shrink-0 border border-slate-600/50 group-hover:border-lootup-500/50 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&auto=format&fit=crop&q=80"
                    alt="Ergonomic chair stored in bay"
                    width={40}
                    height={40}
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    Study Desk &amp; Ergonomic Chair
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Bay 01 · Floor Bin F-08 · 9.4 cu ft</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono text-slate-300 tabular-nums">₹699/mo</span>
                <button
                  type="button"
                  aria-pressed={returnRequestedId === 'item_2'}
                  onClick={() => handleRequestReturn('item_2')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-200 active:scale-[0.96] ${
                    returnRequestedId === 'item_2'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {returnRequestedId === 'item_2' ? 'Return queued' : 'Request return'}
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/90 hover:-translate-y-0.5 transition-[transform,background-color,border-color] duration-200 flex items-center justify-between gap-3 text-xs group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 overflow-hidden shrink-0 border border-slate-600/50 group-hover:border-lootup-500/50 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=120&auto=format&fit=crop&q=80"
                    alt="Hard-shell suitcase trolley"
                    width={40}
                    height={40}
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    Samsonite Luggage Trolley (28&quot;)
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Shelf 02 · Bin S-03 · 3.8 cu ft</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono text-slate-300 tabular-nums">₹299/mo</span>
                <button
                  type="button"
                  aria-pressed={returnRequestedId === 'item_3'}
                  onClick={() => handleRequestReturn('item_3')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-200 active:scale-[0.96] ${
                    returnRequestedId === 'item_3'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {returnRequestedId === 'item_3' ? 'Return queued' : 'Request return'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Vault Action */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="text-slate-400 font-mono text-[11px]">
              Total volume: <span className="text-white font-medium">15.7 cu ft occupied</span>
            </div>
            <SmartLink
              href="/customer/items/new"
              className="inline-flex items-center gap-1.5 text-xs text-lootup-400 hover:text-lootup-300 font-medium transition-colors group"
            >
              <span>Add another item</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
            </SmartLink>
          </div>
        </div>
      )}

      {/* Tab 2: Live Trip Tracking Simulator */}
      {activeTab === 'TRACKING' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-TRACKING`}
          aria-labelledby={`${baseId}-tab-TRACKING`}
          tabIndex={0}
          className="p-5 space-y-4 animate-fade-in"
        >
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-lootup-500/20 text-lootup-400 flex items-center justify-center" aria-hidden="true">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-slate-100">Pickup Lead On The Way</span>
                  <div className="text-[10px] text-slate-400 font-mono">HAL 2nd Stage &rarr; Indiranagar Hub</div>
                </div>
              </div>
              <span className="font-mono text-emerald-400 text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
                <span>ETA 14 mins</span>
              </span>
            </div>

            <div className="relative py-3">
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lootup-500 to-emerald-400 rounded-full origin-left"
                  style={{ width: '68%' }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
                <span className="text-emerald-400 font-medium">Dispatched</span>
                <span className="text-lootup-300 font-medium">En route to your flat</span>
                <span>Vault Check-in</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-700/60">
              <div>
                <div className="text-slate-400 text-[10px] font-mono">Assigned Captain</div>
                <div className="font-medium text-slate-200">Ramesh Kumar</div>
                <div className="text-[10px] text-slate-400 font-mono">Police KYC verified · 142 pickups</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] font-mono">Vehicle ID</div>
                <div className="font-medium text-slate-200">KA-01-EJ-4912</div>
                <div className="text-[10px] text-slate-400 font-mono">Tata Ace Electric Container</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Doorstep Collection OTP</div>
                <div className="text-lg font-mono font-bold text-lootup-400 tracking-widest mt-0.5 tabular-nums">4921</div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono text-right leading-relaxed">
                Share only after captain<br />
                <span className="text-slate-300">applies tamper barcode tape</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-lootup-400 shrink-0" aria-hidden="true" />
            <span>Destination: Indiranagar Sector 2 Metro Facility · 3.2 km away</span>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Tamper Seal Spec */}
      {activeTab === 'SECURITY' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-SECURITY`}
          aria-labelledby={`${baseId}-tab-SECURITY`}
          tabIndex={0}
          className="p-5 space-y-4 animate-fade-in"
        >
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60">
              <Shield className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-slate-200">3-Point Custody Guarantee Protocol</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-slate-300 leading-relaxed">
                  <strong className="text-white">Tamper-evident 3M tape:</strong> Boxes are sealed at your doorstep with serialized barcodes. If tape is removed or sliced, a permanent &ldquo;VOID OPENED&rdquo; watermark is chemically exposed.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-slate-300 leading-relaxed">
                  <strong className="text-white">Biometric Vault Bays:</strong> Facilities are closed to walk-in public access. Only vetted inventory managers access storage racks via dual biometric scans.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-slate-300 leading-relaxed">
                  <strong className="text-white">Continuous CCTV &amp; Climate:</strong> 24/7 high-definition recording stored for 90 days offsite, with automated dehumidifiers keeping humidity strictly below 55% RH.
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-lootup-400" aria-hidden="true" />
              <span className="text-slate-300">Live Audit Seal:</span>
            </div>
            <span className="text-emerald-400 font-semibold">#BLR-8921-VERIFIED</span>
          </div>
        </div>
      )}

      {/* Footer reassurance */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>No security deposit required</span>
        <span>Cancel or retrieve anytime</span>
      </div>
    </div>
  );
}
