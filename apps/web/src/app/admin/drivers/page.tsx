'use client';

import React from 'react';
import { mockDb } from '@lootupspace/database';
import { Star } from 'lucide-react';

export default function AdminDriversPage() {
  const drivers = mockDb.drivers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400">Logistics Personnel</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Fleet Drivers & Logistics Roster
          </h1>
          <p className="text-xs text-slate-400">
            Monitor on-duty drivers, assigned pickup vehicles, GPS coordinates, and completion ratings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map((d) => {
          const user = mockDb.users.find((u) => u.id === d.userId);
          return (
            <div key={d.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-lg" aria-hidden="true">
                    {user?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-sm">{user?.name}</h2>
                    <div className="text-xs text-slate-400 font-mono">{user?.phone}</div>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
                  Active on Duty
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Vehicle Assigned:</span>
                  <strong className="text-white font-mono">{d.vehicleNumber}</strong>
                  <div className="text-[10px] text-slate-500">{d.vehicleType}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Trips & Rating:</span>
                  <div className="text-white font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                    <span>{d.ratingAverage} ({d.totalTripsDone} Trips)</span>
                  </div>
                  <div className="text-[10px] text-emerald-400">Zero Handover Discrepancies</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Current GPS Pin: <strong>{d.currentLat}, {d.currentLng}</strong></span>
                <span className="text-lootup-400 font-mono text-[11px]">DL: {d.licenseNumber}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

