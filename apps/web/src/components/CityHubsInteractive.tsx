import React, { useState, useId, useRef } from 'react';
import { MapPin, CheckCircle2, Shield } from 'lucide-react';
import { SmartLink } from './SmartLink';

type CityCode = 'BLR' | 'BOM' | 'MAA';

const CITY_TABS: Array<{ id: CityCode; label: string }> = [
  { id: 'BLR', label: 'Bengaluru (Active)' },
  { id: 'BOM', label: 'Mumbai (Active)' },
  { id: 'MAA', label: 'Chennai (Active)' }
];

export function CityHubsInteractive() {
  const [selectedCity, setSelectedCity] = useState<CityCode>('BLR');
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const hubs = {
    BLR: {
      name: 'Bengaluru',
      hubLocation: 'Indiranagar 100ft Road (Hub BLR-01) & HSR Layout (Hub BLR-02)',
      climateSpec: '22°C Constant · 48% RH Controlled',
      leadTime: 'Same-day collection in 2-hr slots',
      zones: [
        'Indiranagar',
        'Koramangala',
        'HSR Layout',
        'Bellandur',
        'Whitefield',
        'Hebbal',
        'JP Nagar',
        'Malleshwaram',
        'Richmond Town',
        'Sarjapur Road'
      ],
      sampleRent: 'Avg rent ₹80–₹110/sq ft/mo'
    },
    BOM: {
      name: 'Mumbai',
      hubLocation: 'Bandra-Kurla Complex (Hub BOM-01) & Powai Tech Hub (Hub BOM-02)',
      climateSpec: 'Dual Monsoon Dehumidifier Array (<50% RH)',
      leadTime: 'Daily slots across Island City & Suburbs',
      zones: [
        'Bandra West',
        'Khar & Santacruz',
        'Juhu',
        'Powai',
        'Andheri East & West',
        'Lower Parel',
        'Dadar',
        'Worli',
        'Thane West',
        'Navi Mumbai Vashi'
      ],
      sampleRent: 'Avg rent ₹120–₹180/sq ft/mo'
    },
    MAA: {
      name: 'Chennai',
      hubLocation: 'OMR Perungudi Expressway (Hub MAA-01) & Guindy (Hub MAA-02)',
      climateSpec: 'Anti-Corrosion & Desiccant Air Handling Unit',
      leadTime: 'Morning (9-11 AM) & Evening (4-6 PM) runs',
      zones: [
        'Adyar',
        'Besant Nagar',
        'OMR Corridor',
        'Velachery',
        'Anna Nagar',
        'T. Nagar',
        'Alwarpet',
        'Mylapore',
        'Nungambakkam',
        'Thiruvanmiyur'
      ],
      sampleRent: 'Avg rent ₹55–₹85/sq ft/mo'
    }
  };

  const current = hubs[selectedCity];

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = CITY_TABS.findIndex((t) => t.id === selectedCity);
    let nextIndex = -1;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % CITY_TABS.length;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + CITY_TABS.length) % CITY_TABS.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = CITY_TABS.length - 1;

    if (nextIndex !== -1) {
      e.preventDefault();
      setSelectedCity(CITY_TABS[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header and City Selectors */}
      <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Service Coverage</span>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight mt-1 text-balance">
            Active metro vaults &amp; daily collection routes
          </h2>
          <p className="text-slate-600 text-sm mt-1 text-pretty">
            Centrally located custody hubs in each city ensuring rapid 24-hr retrieval to your doorstep.
          </p>
        </div>

        {/* WAI-ARIA City Toggle Tabs */}
        <div
          role="tablist"
          aria-label="Active metro hubs"
          onKeyDown={handleTabKeyDown}
          className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl"
        >
          {CITY_TABS.map((tab, idx) => {
            const isSelected = selectedCity === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`${baseId}-panel`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedCity(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${selectedCity}`}
        tabIndex={0}
        key={selectedCity}
        className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in"
      >
        {/* Left: Hub Specs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-lootup-600" aria-hidden="true" />
              <div className="font-medium text-sm text-slate-900">{current.name} Custody Infrastructure</div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-[11px] text-slate-500 font-mono">Vault facility address:</div>
                <div className="text-slate-800 font-medium">{current.hubLocation}</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-mono">Climate protection:</div>
                <div className="text-slate-800 font-medium">{current.climateSpec}</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-mono">Collection turnaround:</div>
                <div className="text-slate-800 font-medium">{current.leadTime}</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-mono">Apartment economic context:</div>
                <div className="text-emerald-700 font-mono">{current.sampleRent}</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Full GST Input Tax Credit compliant</span>
            </div>
            <span className="font-mono text-slate-500">SAC 996729</span>
          </div>
        </div>

        {/* Right: Covered Neighborhoods */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Daily Doorstep Service Neighborhoods:
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {current.zones.map((zone) => (
              <li
                key={zone}
                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center gap-2 text-xs font-medium text-slate-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>{zone}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Need storage in another postal code?
            </span>
            <SmartLink
              href="/cities"
              className="font-medium text-slate-900 hover:text-lootup-600 underline transition-colors"
            >
              View complete pincode serviceability list &rarr;
            </SmartLink>
          </div>
        </div>
      </div>
    </div>
  );
}
