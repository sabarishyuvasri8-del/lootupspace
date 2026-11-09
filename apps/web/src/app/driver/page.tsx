import React, { useState } from 'react';
import { mockDb } from '@lootupspace/database';
import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import { SmartLink } from '../../components/SmartLink';

export default function DriverDashboardPage() {
  const [filter, setFilter] = useState<'ALL' | 'PICKUPS' | 'DELIVERIES'>('ALL');

  const pickups = mockDb.pickupRequests;
  const deliveries = mockDb.returnRequests;

  return (
    <div className="space-y-4">
      {/* Route header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-slate-400 block">Dispatch route</span>
          <h1 id="main-content" tabIndex={-1} className="text-sm font-medium text-white">
            Bengaluru Central Hub
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-slate-300 block tabular-nums">{pickups.length + deliveries.length} stops assigned</span>
          <span className="text-[11px] text-slate-400 font-mono">Window ends 6:00 PM</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg text-xs">
        <button
          type="button"
          aria-pressed={filter === 'ALL'}
          onClick={() => setFilter('ALL')}
          className={`py-1.5 rounded transition-colors duration-150 ${filter === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
        >
          All ({pickups.length + deliveries.length})
        </button>
        <button
          type="button"
          aria-pressed={filter === 'PICKUPS'}
          onClick={() => setFilter('PICKUPS')}
          className={`py-1.5 rounded transition-colors duration-150 ${filter === 'PICKUPS' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Pickups ({pickups.length})
        </button>
        <button
          type="button"
          aria-pressed={filter === 'DELIVERIES'}
          onClick={() => setFilter('DELIVERIES')}
          className={`py-1.5 rounded transition-colors duration-150 ${filter === 'DELIVERIES' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Returns ({deliveries.length})
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {/* Pickups */}
        {(filter === 'ALL' || filter === 'PICKUPS') &&
          pickups.map((pickup, idx) => (
            <div
              key={pickup.id}
              className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Stop {idx + 1} · Collection
                </span>
                <span className="text-xs font-mono text-slate-400">{pickup.bookingNumber}</span>
              </div>

              <div>
                <h2 className="text-sm font-medium text-white">{pickup.customerName}</h2>
                <div className="text-xs text-slate-400 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                  <span>{pickup.address.line1}, {pickup.address.line2}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Slot: {pickup.slotStartTime} - {pickup.slotEndTime}
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg text-xs space-y-0.5 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">
                  {pickup.items.length} items to collect:
                </div>
                <div className="text-slate-300 text-[11px] truncate">
                  {pickup.items.map((i: any) => i.name).join(', ')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${pickup.address.line1}, ${pickup.address.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-150"
                >
                  <Navigation className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                  <span>Maps</span>
                </a>

                <SmartLink
                  href={`/driver/job/${pickup.id}?type=pickup`}
                  className="py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-xs font-medium flex items-center justify-center gap-1 transition-colors duration-150"
                >
                  <span>Verify items</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                </SmartLink>
              </div>
            </div>
          ))}

        {/* Deliveries */}
        {(filter === 'ALL' || filter === 'DELIVERIES') &&
          deliveries.map((ret) => (
            <div
              key={ret.id}
              className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Return delivery
                </span>
                <span className="text-xs font-mono text-slate-400">{ret.returnNumber}</span>
              </div>

              <div>
                <h2 className="text-sm font-medium text-white">{ret.customerName}</h2>
                <div className="text-xs text-slate-400 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                  <span>{ret.address.line1}, {ret.address.city}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Slot: {ret.slotTime}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${ret.address.line1}, ${ret.address.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-150"
                >
                  <Navigation className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                  <span>Maps</span>
                </a>

                <SmartLink
                  href={`/driver/job/${ret.id}?type=return`}
                  className="py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-xs font-medium flex items-center justify-center gap-1 transition-colors duration-150"
                >
                  <span>Handover</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                </SmartLink>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
