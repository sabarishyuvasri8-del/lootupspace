'use client';

import React, { useState, useId } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SERVICEABLE_CITIES } from '@lootupspace/shared';
import { CheckCircle, Building } from 'lucide-react';

export default function CitiesPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<{ serviceable: boolean; pincode: string; city?: string; hub?: string } | null>(null);
  const pincodeInputId = useId();

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = query.trim();
    if (!pin) return;

    for (const city of SERVICEABLE_CITIES) {
      const pinIdx = city.pincodes.indexOf(pin);
      if (pinIdx !== -1) {
        setStatus({
          serviceable: true,
          pincode: pin,
          city: city.name,
          hub: city.hubs[pinIdx % city.hubs.length]
        });
        return;
      }
    }
    setStatus({
      serviceable: false,
      pincode: pin
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-lootup-600">Metros We Power</span>
          <h1 id="main-content" tabIndex={-1} className="text-3xl sm:text-5xl font-semibold text-slate-900 tracking-tight text-balance">
            Serviceable Cities &amp; Pincodes
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto text-pretty">
            Live in Bengaluru, Mumbai, and Chennai. Check your local pin code below to verify same-day and scheduled doorstep collection.
          </p>
        </div>

        {/* Pincode Search Bar */}
        <search className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto block">
          <form onSubmit={handleCheck} className="flex gap-2">
            <label htmlFor={pincodeInputId} className="visually-hidden">
              Enter 6-digit serviceability pincode
            </label>
            <input
              id={pincodeInputId}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="Enter 6-digit Pincode (e.g. 560038, 400050, 600096)"
              value={query}
              onChange={(e) => setQuery(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-lootup-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition-colors"
            >
              Verify
            </button>
          </form>

          <div aria-live="polite" aria-atomic="true">
            {status && (
              <div className={`mt-4 p-4 rounded-2xl text-xs sm:text-sm font-semibold border ${status.serviceable ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'}`}>
                {status.serviceable ? (
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                      <span>Pincode {status.pincode} is fully operational in {status.city}!</span>
                    </div>
                    <div className="text-xs text-emerald-700 mt-1">Dispatched from: {status.hub}</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold">Pincode {status.pincode} is currently outside our immediate active zone.</div>
                    <div className="text-xs text-amber-800 mt-1">Our fleet is expanding rapidly. You will be prioritized as soon as your neighborhood launches.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </search>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICEABLE_CITIES.map((city) => (
            <div key={city.code} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lootup-700 bg-lootup-50 px-2.5 py-1 rounded-full uppercase">
                  {city.code} Metro
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
                  <span>Active Hubs</span>
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-slate-900">{city.name}</h2>
              <p className="text-xs text-slate-500">{city.state}, India</p>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Fulfillment Hubs:</span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {city.hubs.map((hub) => (
                    <li key={hub} className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-lootup-600" aria-hidden="true" />
                      <span>{hub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-xs text-slate-500">
                Sample Covered Pincodes: {city.pincodes.slice(0, 4).join(', ')}...
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
