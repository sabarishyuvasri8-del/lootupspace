'use client';

import React, { useState, useEffect } from 'react';
import { mockDb } from '@lootupspace/database';
import { MapPin, Navigation, ChevronRight, Truck, Warehouse, CheckCircle2, AlertCircle } from 'lucide-react';
import { SmartLink } from '../../components/SmartLink';
import { PickupStatus, ReturnStatus } from '@lootupspace/shared';

export default function DriverDashboardPage() {
  const [filter, setFilter] = useState<'ALL' | 'PICKUPS' | 'DELIVERIES'>('ALL');
  const [allPickups, setAllPickups] = useState(() => [...mockDb.pickupRequests]);
  const [allDeliveries, setAllDeliveries] = useState(() => [...mockDb.returnRequests]);

  useEffect(() => {
    const handleUpdate = () => {
      setAllPickups([...mockDb.pickupRequests]);
      setAllDeliveries([...mockDb.returnRequests]);
    };
    window.addEventListener('lootup_db_updated', handleUpdate);
    return () => window.removeEventListener('lootup_db_updated', handleUpdate);
  }, []);

  // Drivers only see orders assigned to them by the Warehouse
  const pickups = allPickups.filter(
    (p) => p.driverId && p.status !== PickupStatus.BOOKED && p.status !== PickupStatus.RECEIVED_AT_WAREHOUSE
  );
  const deliveries = allDeliveries.filter(
    (d) => d.driverId && d.status !== ReturnStatus.REQUESTED && d.status !== ReturnStatus.DELIVERED
  );

  const totalAssignedStops = pickups.length + deliveries.length;

  return (
    <div className="space-y-4">
      {/* Route header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 block">Dispatch route</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Active Manifest
            </span>
          </div>
          <h1 id="main-content" tabIndex={-1} className="text-sm font-medium text-white mt-0.5">
            Bengaluru Central Hub · Assigned Stops
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-300 block tabular-nums">{totalAssignedStops} stops assigned</span>
            <span className="text-[11px] text-slate-400 font-mono">Dispatched by WH-BLR-01</span>
          </div>
          <SmartLink
            href="/warehouse"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-colors"
          >
            Warehouse Desk
          </SmartLink>
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
          All ({totalAssignedStops})
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

      {/* Empty State */}
      {totalAssignedStops === 0 && (
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center space-y-3">
          <Warehouse className="w-10 h-10 text-slate-600 mx-auto" />
          <h2 className="text-sm font-medium text-white">No Active Route Stops Dispatched</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All assigned jobs have been completed, or incoming customer orders are awaiting review &amp; assignment by the Warehouse Dispatch Desk.
          </p>
          <SmartLink
            href="/warehouse"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Open Warehouse Dispatch Desk →</span>
          </SmartLink>
        </div>
      )}

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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Stop {idx + 1} · Doorstep Collection
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

              {pickup.notes && (
                <div className="p-2 bg-slate-950 rounded-lg text-[11px] text-amber-400/90 border border-slate-800">
                  <span className="font-semibold text-slate-400">Dispatch Instructions: </span>
                  {pickup.notes}
                </div>
              )}

              <div className="p-2.5 bg-slate-950 rounded-lg text-xs space-y-0.5 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">
                  {pickup.items.length} items to collect into vehicle:
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
                  <span>Verify items (OTP)</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                </SmartLink>
              </div>
            </div>
          ))}

        {/* Deliveries */}
        {(filter === 'ALL' || filter === 'DELIVERIES') &&
          deliveries.map((ret, idx) => (
            <div
              key={ret.id}
              className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Stop {pickups.length + idx + 1} · Return Delivery
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

              {ret.notes && (
                <div className="p-2 bg-slate-950 rounded-lg text-[11px] text-indigo-300 border border-slate-800">
                  <span className="font-semibold text-slate-400">Warehouse Note: </span>
                  {ret.notes}
                </div>
              )}

              <div className="p-2.5 bg-slate-950 rounded-lg text-xs space-y-0.5 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">
                  {ret.items.length} items to deliver to doorstep:
                </div>
                <div className="text-slate-300 text-[11px] truncate">
                  {ret.items.map((i: any) => i.name).join(', ')}
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
                  <span>Handover (OTP)</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                </SmartLink>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
