'use client';

import React from 'react';
import { mockDb } from '@lootupspace/database';
import { MapPin, Layers, Thermometer, Shield } from 'lucide-react';

export default function AdminWarehousesPage() {
  const warehouses = mockDb.warehouses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400">Facility Infrastructure</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Warehouse Hubs & Zone Architecture
          </h1>
          <p className="text-xs text-slate-400">
            Configure cubic foot capacity limits, climate zones, biometric vault racks, and fulfillment staff.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {warehouses.map((wh) => {
          const percent = Math.round((wh.usedCubicFeet / wh.totalCubicFeet) * 100);
          return (
            <div key={wh.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-white text-base">{wh.name}</h2>
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {wh.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                    <span>{wh.address}</span>
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active Operational Hub
                </span>
              </div>

              {/* Occupancy bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Vault Floor Utilization:</span>
                  <span className="font-bold text-white tabular-nums">{percent}% ({wh.usedCubicFeet} / {wh.totalCubicFeet} cu ft)</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${wh.name} vault floor utilization`}
                  className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800"
                >
                  <div
                    className="w-full h-full bg-lootup-600 rounded-full origin-left"
                    style={{ transform: `scaleX(${percent / 100})` }}
                  />
                </div>
              </div>

              {/* Environmental security badges */}
              <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  Climate Guard (20-24°C)
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  Biometric Vault Access
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                  Dry-Powder Automated Fire Suppression
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

