'use client';

import React, { useState } from 'react';
import { mockDb } from '@lootupspace/database';
import { ZoneType } from '@lootupspace/shared';
import { Thermometer } from 'lucide-react';

export default function WarehouseInventoryMapPage() {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  const bins = mockDb.bins;
  const items = mockDb.storageItems;

  const filteredBins = selectedZone === 'ALL'
    ? bins
    : bins.filter((b) => b.zoneType === selectedZone);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-indigo-600">Storage Capacity Map</span>
        <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
          Rack &amp; Bin Occupancy Grid
        </h1>
        <p className="text-xs text-slate-500 text-pretty">
          Visual heat map of bins, zones, and cubic foot utilization across Bengaluru Indiranagar Hub.
        </p>
      </div>

      {/* Warehouse Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Capacity</span>
          <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">50,000 cu ft</div>
          <span className="text-[11px] text-slate-500">Gross Floor Area</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Utilized Volume</span>
          <div className="text-2xl font-semibold text-indigo-600 mt-1 tabular-nums">18,240 cu ft</div>
          <span className="text-[11px] text-emerald-700 font-bold">36.5% Occupied</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Active Bins</span>
          <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">{bins.length * 12} Bins</div>
          <span className="text-[11px] text-slate-500">Across 4 Zones</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Environment Status</span>
          <div className="text-sm font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4" aria-hidden="true" />
            <span>22°C • 48% Humidity</span>
          </div>
          <span className="text-[11px] text-slate-500">Optimal Climate Guard</span>
        </div>
      </div>

      {/* Zone filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <button
          type="button"
          aria-pressed={selectedZone === 'ALL'}
          onClick={() => setSelectedZone('ALL')}
          className={`px-4 py-2 rounded-xl transition-colors duration-150 ${selectedZone === 'ALL' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
        >
          All Zones ({bins.length})
        </button>
        <button
          type="button"
          aria-pressed={selectedZone === ZoneType.STANDARD}
          onClick={() => setSelectedZone(ZoneType.STANDARD)}
          className={`px-4 py-2 rounded-xl transition-colors duration-150 ${selectedZone === ZoneType.STANDARD ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
        >
          Standard Dry Storage
        </button>
        <button
          type="button"
          aria-pressed={selectedZone === ZoneType.CLIMATE_CONTROLLED}
          onClick={() => setSelectedZone(ZoneType.CLIMATE_CONTROLLED)}
          className={`px-4 py-2 rounded-xl transition-colors duration-150 ${selectedZone === ZoneType.CLIMATE_CONTROLLED ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
        >
          Climate-Controlled Vault
        </button>
        <button
          type="button"
          aria-pressed={selectedZone === ZoneType.HIGH_VALUE_VAULT}
          onClick={() => setSelectedZone(ZoneType.HIGH_VALUE_VAULT)}
          className={`px-4 py-2 rounded-xl transition-colors duration-150 ${selectedZone === ZoneType.HIGH_VALUE_VAULT ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
        >
          Biometric Security Vault
        </button>
      </div>

      {/* Bins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBins.map((bin) => {
          const itemsInBin = items.filter((i) => i.binCode === bin.code);
          const percent = Math.min(100, Math.round((bin.usedCubicFeet / bin.maxCubicFeet) * 100));

          return (
            <div key={bin.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">Bin Code</span>
                  <h2 className="font-mono text-lg font-semibold text-slate-900">{bin.code}</h2>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {bin.zoneName}
                </span>
              </div>

              {/* Capacity meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Occupancy:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{percent}% ({bin.usedCubicFeet} / {bin.maxCubicFeet} cu ft)</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${bin.code} occupancy`}
                  className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
                >
                  <div
                    className={`w-full h-full rounded-full origin-left transition-transform duration-500 ${
                      percent > 85 ? 'bg-rose-500' : percent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ transform: `scaleX(${percent / 100})` }}
                  />
                </div>
              </div>

              {/* Items housed in this bin */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Stored Items ({itemsInBin.length})
                </span>
                {itemsInBin.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">Bin is empty &amp; ready for assignment</span>
                ) : (
                  <div className="space-y-1">
                    {itemsInBin.map((it) => (
                      <div key={it.id} className="text-xs text-slate-800 flex items-center justify-between">
                        <span className="truncate max-w-[180px] font-medium">{it.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{it.qrCode}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

