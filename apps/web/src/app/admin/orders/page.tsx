'use client';

import React, { useState } from 'react';
import { mockDb } from '@lootupspace/database';
import { Truck, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [pickups, setPickups] = useState(() => [...mockDb.pickupRequests]);
  const [returns] = useState(mockDb.returnRequests);
  const [reassignedSuccess, setReassignedSuccess] = useState<string | null>(null);

  const handleReassign = (orderId: string) => {
    const pickup = mockDb.pickupRequests.find((p) => p.id === orderId);
    if (pickup) {
      pickup.driverName = 'Ramesh Kumar (Pickup Lead)';
      pickup.driverPhone = '+919876543211';
      pickup.updatedAt = new Date().toISOString();
      setPickups([...mockDb.pickupRequests]);
      setReassignedSuccess(`Driver reassigned for ${pickup.bookingNumber}`);
      setTimeout(() => setReassignedSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400">Fleet Dispatch</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Orders & Doorstep Dispatches
          </h1>
          <p className="text-xs text-slate-400">
            Monitor pickup routes, reassign drivers, update time slots, and verify handover OTPs.
          </p>
        </div>
      </div>

      {reassignedSuccess && (
        <div role="status" aria-live="polite" className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>{reassignedSuccess}</span>
        </div>
      )}

      {/* Pickup Requests Table */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <h2 id="pickup-bookings-heading" className="font-bold text-white text-base">Pickup Bookings ({pickups.length})</h2>
          </div>
        </div>

        <div tabIndex={0} role="region" aria-labelledby="pickup-bookings-heading" className="overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="visually-hidden">Scheduled pickup bookings and assigned fleet drivers</caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th scope="col" className="py-3 px-3 font-semibold">Booking ID</th>
                <th scope="col" className="py-3 px-3 font-semibold">Customer</th>
                <th scope="col" className="py-3 px-3 font-semibold">Address</th>
                <th scope="col" className="py-3 px-3 font-semibold">Slot</th>
                <th scope="col" className="py-3 px-3 font-semibold">Assigned Driver</th>
                <th scope="col" className="py-3 px-3 font-semibold">Status</th>
                <th scope="col" className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pickups.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors duration-150">
                  <th scope="row" className="py-3.5 px-3 font-mono font-bold text-lootup-400 text-left">{p.bookingNumber}</th>
                  <td className="py-3.5 px-3 font-bold text-white">
                    <div>{p.customerName}</div>
                    <div className="text-[10px] text-slate-400">{p.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 truncate max-w-[200px]">
                    {p.address.line1}, {p.address.city}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <div>{p.slotDate}</div>
                    <div className="text-[10px] text-slate-400">{p.slotStartTime} - {p.slotEndTime}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <span className="font-bold text-white block">{p.driverName || 'Unassigned'}</span>
                    <span className="text-[10px] text-slate-400">{p.driverVehicleNumber}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleReassign(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors duration-150"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Requests Table */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            <h2 id="return-deliveries-heading" className="font-bold text-white text-base">Return Deliveries ({returns.length})</h2>
          </div>
        </div>

        <div tabIndex={0} role="region" aria-labelledby="return-deliveries-heading" className="overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="visually-hidden">Scheduled return deliveries and verification OTPs</caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th scope="col" className="py-3 px-3 font-semibold">Return ID</th>
                <th scope="col" className="py-3 px-3 font-semibold">Customer</th>
                <th scope="col" className="py-3 px-3 font-semibold">Items</th>
                <th scope="col" className="py-3 px-3 font-semibold">Slot</th>
                <th scope="col" className="py-3 px-3 font-semibold">Delivery OTP</th>
                <th scope="col" className="py-3 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {returns.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/50 transition-colors duration-150">
                  <th scope="row" className="py-3.5 px-3 font-mono font-bold text-indigo-400 text-left">{r.returnNumber}</th>
                  <td className="py-3.5 px-3 font-bold text-white">{r.customerName}</td>
                  <td className="py-3.5 px-3 text-slate-300">{r.items.length} items</td>
                  <td className="py-3.5 px-3 text-slate-300">{r.slotDate} ({r.slotTime})</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{r.deliveryOtp}</td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

