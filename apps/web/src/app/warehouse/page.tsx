'use client';

import React, { useState, useEffect, useId } from 'react';
import { mockDb } from '@lootupspace/database';
import {
  PickupStatus,
  ReturnStatus,
  VehicleType,
  StorageItemStatus
} from '@lootupspace/shared';
import { formatInr } from '../../lib/utils';
import { SmartLink } from '../../components/SmartLink';
import {
  ClipboardCheck,
  Truck,
  RotateCcw,
  Package,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Send,
  Boxes,
  Layers,
  ChevronRight,
  UserCheck,
  Check
} from 'lucide-react';

export default function WarehouseDispatchCommandPage() {
  const [filter, setFilter] = useState<'PENDING' | 'PICKUPS' | 'RETURNS' | 'DISPATCHED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<Record<string, string>>({});
  const [driverNotes, setDriverNotes] = useState<Record<string, string>>({});
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Sync state with mockDb
  const [pickups, setPickups] = useState(() => [...mockDb.pickupRequests]);
  const [returns, setReturns] = useState(() => [...mockDb.returnRequests]);
  const drivers = mockDb.drivers;

  useEffect(() => {
    const handleUpdate = () => {
      setPickups([...mockDb.pickupRequests]);
      setReturns([...mockDb.returnRequests]);
    };
    window.addEventListener('lootup_db_updated', handleUpdate);
    return () => window.removeEventListener('lootup_db_updated', handleUpdate);
  }, []);

  // Compute counts
  const pendingPickups = pickups.filter((p) => !p.driverId || p.status === PickupStatus.BOOKED);
  const pendingReturns = returns.filter((r) => !r.driverId || r.status === ReturnStatus.REQUESTED);
  const totalPending = pendingPickups.length + pendingReturns.length;

  const dispatchedPickups = pickups.filter((p) => p.driverId && p.status !== PickupStatus.BOOKED && p.status !== PickupStatus.RECEIVED_AT_WAREHOUSE);
  const dispatchedReturns = returns.filter((r) => r.driverId && r.status !== ReturnStatus.REQUESTED && r.status !== ReturnStatus.DELIVERED);
  const totalDispatched = dispatchedPickups.length + dispatchedReturns.length;

  // Dispatch Pickup Request
  const handleDispatchPickup = (pickupId: string) => {
    const driverId = selectedDriverId[pickupId] || drivers[0].id;
    const notes = driverNotes[pickupId] || 'Bring standard 5-ply cartons. Call customer upon arrival.';

    const updated = mockDb.dispatchPickup(pickupId, driverId, notes);
    if (updated) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lootup_db_updated'));
      }
      setPickups([...mockDb.pickupRequests]);
      setDispatchSuccess(`Pickup #${updated.bookingNumber} successfully assigned & dispatched to ${updated.driverName}!`);
      setTimeout(() => setDispatchSuccess(null), 4000);
    }
  };

  // Dispatch Return Request
  const handleDispatchReturn = (returnId: string) => {
    const driverId = selectedDriverId[returnId] || drivers[0].id;
    const notes = driverNotes[returnId] || 'Deliver carefully to customer doorstep. Verify 4-digit handover OTP.';

    const updated = mockDb.dispatchReturn(returnId, driverId, notes);
    if (updated) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lootup_db_updated'));
      }
      setReturns([...mockDb.returnRequests]);
      setDispatchSuccess(`Return #${updated.returnNumber} dispatched to ${updated.driverName} for doorstep delivery!`);
      setTimeout(() => setDispatchSuccess(null), 4000);
    }
  };

  // Retrieve Return Items from Rack
  const handleMarkRetrieved = (returnId: string) => {
    const updated = mockDb.retrieveReturnItems(returnId);
    if (updated) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lootup_db_updated'));
      }
      setReturns([...mockDb.returnRequests]);
      setDispatchSuccess(`Items for ${updated.returnNumber} marked retrieved from vault bins! Now assign a driver.`);
      setTimeout(() => setDispatchSuccess(null), 4000);
    }
  };

  // Filtered requests list
  const filteredPickups = pickups.filter((p) => {
    if (filter === 'PENDING' && (p.driverId && p.status !== PickupStatus.BOOKED)) return false;
    if (filter === 'DISPATCHED' && (!p.driverId || p.status === PickupStatus.BOOKED || p.status === PickupStatus.RECEIVED_AT_WAREHOUSE)) return false;
    if (filter === 'RETURNS') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBooking = p.bookingNumber.toLowerCase().includes(q);
      const matchCust = p.customerName.toLowerCase().includes(q);
      const matchAddr = `${p.address.line1} ${p.address.city} ${p.address.pincode}`.toLowerCase().includes(q);
      const matchItems = p.items.some((it: any) => it.name.toLowerCase().includes(q));
      return matchBooking || matchCust || matchAddr || matchItems;
    }
    return true;
  });

  const filteredReturns = returns.filter((r) => {
    if (filter === 'PENDING' && (r.driverId && r.status !== ReturnStatus.REQUESTED)) return false;
    if (filter === 'DISPATCHED' && (!r.driverId || r.status === ReturnStatus.REQUESTED || r.status === ReturnStatus.DELIVERED)) return false;
    if (filter === 'PICKUPS') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = r.returnNumber.toLowerCase().includes(q);
      const matchCust = r.customerName.toLowerCase().includes(q);
      const matchAddr = `${r.address.line1} ${r.address.city}`.toLowerCase().includes(q);
      const matchItems = r.items.some((it: any) => it.name.toLowerCase().includes(q));
      return matchNum || matchCust || matchAddr || matchItems;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Warehouse Fulfillment Operations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Triage Desk
            </span>
          </div>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-950 tracking-tight mt-1 text-balance">
            Customer Requests &amp; Driver Dispatch Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 text-pretty">
            Inspect incoming customer pickup and return requests, verify volumetric specifications, and assign drivers for route execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SmartLink
            href="/warehouse/intake"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Open Inbound Scanner</span>
          </SmartLink>
          <SmartLink
            href="/driver"
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-medium text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Truck className="w-4 h-4 text-lootup-600" />
            <span>Switch to Driver View</span>
          </SmartLink>
        </div>
      </div>

      {/* Operational KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Action</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalPending}</div>
          <span className="text-[11px] text-amber-700 font-medium font-mono">
            {pendingPickups.length} Pickups · {pendingReturns.length} Returns
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active on Road</span>
            <Truck className="w-4 h-4 text-lootup-500" />
          </div>
          <div className="text-2xl font-bold text-lootup-700 mt-1 tabular-nums">{totalDispatched}</div>
          <span className="text-[11px] text-slate-500 font-mono">Assigned to fleet drivers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Fleet Ready</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">{drivers.length}</div>
          <span className="text-[11px] text-slate-500 font-mono">Tata Ace &amp; 3W EV active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Vault Staging</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">Bay 2-B</div>
          <span className="text-[11px] text-slate-500 font-mono">18,240 cu ft allocated</span>
        </div>
      </div>

      {/* Toast Alert */}
      {dispatchSuccess && (
        <div role="status" aria-live="polite" className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-medium flex items-center justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{dispatchSuccess}</span>
          </div>
          <SmartLink href="/driver" className="underline font-bold text-emerald-800 hover:text-emerald-950">
            View in Driver Portal →
          </SmartLink>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'PENDING'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Action Required ({totalPending})
            </button>
            <button
              type="button"
              onClick={() => setFilter('PICKUPS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'PICKUPS'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Customer Pickups ({pickups.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('RETURNS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'RETURNS'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Customer Returns ({returns.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('DISPATCHED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'DISPATCHED'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dispatched to Drivers ({totalDispatched})
            </button>
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Records
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search booking #, customer, pincode..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Customer Requests Work Area */}
      <div className="space-y-6">
        {/* PICKUP REQUESTS */}
        {filteredPickups.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-lootup-600" />
                <h2 className="font-semibold text-slate-900 text-sm">
                  Customer Doorstep Pickup Requests ({filteredPickups.length})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Collect from doorstep → Transport to WH-BLR-01
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredPickups.map((pickup) => {
                const isPending = !pickup.driverId || pickup.status === PickupStatus.BOOKED;
                const totalCuFt = pickup.items.reduce((sum: number, it: any) => sum + (it.cubicFeet || 1.5), 0);

                return (
                  <div
                    key={pickup.id}
                    className={`bg-white rounded-2xl border transition-shadow duration-150 shadow-sm p-6 space-y-5 ${
                      isPending ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                    }`}
                  >
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-100">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-slate-900">{pickup.bookingNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-lootup-50 text-lootup-800 border border-lootup-200">
                          DOORSTEP PICKUP
                        </span>
                        {isPending ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            PENDING WAREHOUSE DISPATCH
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" />
                            DISPATCHED · {pickup.driverName}
                          </span>
                        )}
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-500 font-mono">Target slot: </span>
                        <strong className="text-slate-900">{pickup.slotDate} ({pickup.slotStartTime} - {pickup.slotEndTime})</strong>
                      </div>
                    </div>

                    {/* Customer & Location Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block">Customer details</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{pickup.customerName}</div>
                        <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{pickup.customerPhone}</span>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <span className="text-[11px] font-mono text-slate-400 block">Pickup location</span>
                        <div className="text-slate-800 flex items-start gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>
                            {pickup.address.line1}, {pickup.address.line2 ? `${pickup.address.line2}, ` : ''}
                            {pickup.address.city} - {pickup.address.pincode}
                          </span>
                        </div>
                        {pickup.notes && (
                          <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                            <strong>Customer packaging notes:</strong> {pickup.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items Checklist to Verify */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          Items to Collect ({pickup.items.length}) · Est. Volume: {totalCuFt.toFixed(1)} cu ft
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Recommended Vehicle: {totalCuFt > 20 ? 'Tata Ace Mini Truck' : '3-Wheeler EV'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {pickup.items.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 shadow-xs">
                            <img
                              src={item.photos?.[0]?.url || item.photos?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'}
                              alt={item.name}
                              width={48}
                              height={48}
                              loading="lazy"
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="overflow-hidden text-xs">
                              <div className="font-bold text-slate-900 truncate">{item.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                {item.length}×{item.width}×{item.height} cm ({item.cubicFeet || '1.5'} cu ft)
                              </div>
                              <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono mt-0.5">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warehouse Driver Assignment Console */}
                    {isPending ? (
                      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-amber-700" />
                            Warehouse Action: Assign Driver &amp; Route
                          </span>
                          <span className="text-[11px] font-mono text-amber-800">
                            Handover OTP: <strong className="text-amber-950">{pickup.pickupOtp}</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                          <div className="sm:col-span-5">
                            <label className="block text-[11px] font-mono text-slate-600 mb-1">
                              Select Fleet Driver
                            </label>
                            <select
                              value={selectedDriverId[pickup.id] || drivers[0].id}
                              onChange={(e) => setSelectedDriverId({ ...selectedDriverId, [pickup.id]: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            >
                              {drivers.map((drv) => (
                                <option key={drv.id} value={drv.id}>
                                  {drv.name} ({drv.vehicleNumber} · {drv.cluster || 'Bengaluru Central'})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[11px] font-mono text-slate-600 mb-1">
                              Supervisor Driver Instructions
                            </label>
                            <input
                              type="text"
                              value={driverNotes[pickup.id] || ''}
                              onChange={(e) => setDriverNotes({ ...driverNotes, [pickup.id]: e.target.value })}
                              placeholder="e.g. Bring 2 large boxes & tape"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-3 flex items-end">
                            <button
                              type="button"
                              onClick={() => handleDispatchPickup(pickup.id)}
                              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors duration-150 active:scale-[0.98]"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Approve &amp; Dispatch</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-slate-800">
                            Dispatched to <strong>{pickup.driverName}</strong> ({pickup.driverVehicleNumber})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SmartLink
                            href={`/customer/tracking/${pickup.id}`}
                            className="text-lootup-700 hover:text-lootup-900 font-semibold underline text-xs"
                          >
                            View Live Customer Tracking →
                          </SmartLink>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RETURN REQUESTS */}
        {filteredReturns.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <h2 className="font-semibold text-slate-900 text-sm">
                  Customer Vault Return Requests ({filteredReturns.length})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Retrieve from Bin Racks → Dispatch to Customer Doorstep
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredReturns.map((ret) => {
                const isPendingRetrieval = ret.status === ReturnStatus.REQUESTED;
                const isReadyForDriver = ret.status === ReturnStatus.ITEMS_RETRIEVED;
                const isDispatched = ret.driverId && ret.status !== ReturnStatus.REQUESTED;

                return (
                  <div
                    key={ret.id}
                    className={`bg-white rounded-2xl border transition-shadow duration-150 shadow-sm p-6 space-y-5 ${
                      !isDispatched ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-slate-200'
                    }`}
                  >
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-100">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-slate-900">{ret.returnNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          CUSTOMER RETURN
                        </span>
                        {isPendingRetrieval && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            AWAITING RACK RETRIEVAL
                          </span>
                        )}
                        {isReadyForDriver && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                            ITEMS RETRIEVED · READY FOR DRIVER
                          </span>
                        )}
                        {isDispatched && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" />
                            DISPATCHED · {ret.driverName}
                          </span>
                        )}
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-500 font-mono">Target slot: </span>
                        <strong className="text-slate-900">{ret.slotDate} ({ret.slotTime})</strong>
                      </div>
                    </div>

                    {/* Customer & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block">Customer details</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{ret.customerName}</div>
                        <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{ret.customerPhone}</span>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <span className="text-[11px] font-mono text-slate-400 block">Delivery destination</span>
                        <div className="text-slate-800 flex items-start gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>
                            {ret.address.line1}, {ret.address.line2 ? `${ret.address.line2}, ` : ''}
                            {ret.address.city} - {ret.address.pincode}
                          </span>
                        </div>
                        {ret.notes && (
                          <div className="mt-1.5 text-[11px] text-slate-600 italic">
                            Customer note: "{ret.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vault Bins & Items Checklist */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          Items to Pull from Vault Rack Bins ({ret.items.length})
                        </span>
                        <SmartLink href="/warehouse/outbound" className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium">
                          Open Outbound Pick Sheet →
                        </SmartLink>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ret.items.map((it: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/30 flex items-center gap-3">
                            <img
                              src={it.photos?.[0]?.url || it.photos?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'}
                              alt={it.name}
                              width={48}
                              height={48}
                              loading="lazy"
                              className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-indigo-200"
                            />
                            <div className="overflow-hidden text-xs">
                              <div className="font-bold text-slate-900 truncate">{it.name}</div>
                              <div className="text-indigo-700 font-mono font-bold text-xs mt-0.5">
                                Rack Bin: {it.binCode || 'B-02-R3-B4'}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">{it.qrCode}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warehouse Actions: Retrieval & Dispatch */}
                    {!isDispatched ? (
                      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                            <RotateCcw className="w-4 h-4 text-indigo-700" />
                            Warehouse Action: Rack Retrieval &amp; Driver Handoff
                          </span>
                          <span className="text-[11px] font-mono text-indigo-900">
                            Customer Delivery OTP: <strong className="text-indigo-950">{ret.deliveryOtp}</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                          {isPendingRetrieval && (
                            <div className="sm:col-span-3 flex items-end">
                              <button
                                type="button"
                                onClick={() => handleMarkRetrieved(ret.id)}
                                className="w-full py-2 px-3 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Confirm Rack Pick</span>
                              </button>
                            </div>
                          )}

                          <div className={isPendingRetrieval ? "sm:col-span-4" : "sm:col-span-5"}>
                            <label className="block text-[11px] font-mono text-slate-600 mb-1">
                              Select Delivery Driver
                            </label>
                            <select
                              value={selectedDriverId[ret.id] || drivers[0].id}
                              onChange={(e) => setSelectedDriverId({ ...selectedDriverId, [ret.id]: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            >
                              {drivers.map((drv) => (
                                <option key={drv.id} value={drv.id}>
                                  {drv.name} ({drv.vehicleNumber})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className={isPendingRetrieval ? "sm:col-span-2" : "sm:col-span-4"}>
                            <label className="block text-[11px] font-mono text-slate-600 mb-1">
                              Driver Note
                            </label>
                            <input
                              type="text"
                              value={driverNotes[ret.id] || ''}
                              onChange={(e) => setDriverNotes({ ...driverNotes, [ret.id]: e.target.value })}
                              placeholder="e.g. Verify OTP"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-3 flex items-end">
                            <button
                              type="button"
                              onClick={() => handleDispatchReturn(ret.id)}
                              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors duration-150 active:scale-[0.98]"
                            >
                              <Send className="w-3.5 h-3.5 text-amber-400" />
                              <span>Dispatch Delivery</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-slate-800">
                            Dispatched for delivery with <strong>{ret.driverName}</strong>
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          Handover OTP: <strong>{ret.deliveryOtp}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredPickups.length === 0 && filteredReturns.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-slate-800 text-base">No Matching Requests Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All pending customer requests have been processed or no entries match your search query.
            </p>
            <button
              type="button"
              onClick={() => { setFilter('ALL'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
