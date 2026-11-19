'use client';

import React, { useState, useEffect } from 'react';
import { mockDb } from '@lootupspace/database';
import { Truck, CheckCircle2, RotateCcw, PackageCheck, Send, MapPin, Phone } from 'lucide-react';
import { ReturnStatus } from '@lootupspace/shared';
import { SmartLink } from '../../../components/SmartLink';

export default function OutboundPickListPage() {
  const [returnOrders, setReturnOrders] = useState(() => [...mockDb.returnRequests]);
  const [pickedMap, setPickedMap] = useState<Record<string, boolean>>({});
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);

  const drivers = mockDb.drivers;

  useEffect(() => {
    const handleUpdate = () => {
      setReturnOrders([...mockDb.returnRequests]);
    };
    window.addEventListener('lootup_db_updated', handleUpdate);
    return () => window.removeEventListener('lootup_db_updated', handleUpdate);
  }, []);

  const togglePicked = (itemId: string) => {
    setPickedMap((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleHandoverToDriver = (returnId: string) => {
    const driverId = selectedDrivers[returnId] || drivers[0].id;
    const updated = mockDb.dispatchReturn(returnId, driverId, 'Retrieved from rack bins and loaded onto outbound vehicle.');
    if (updated) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lootup_db_updated'));
      }
      setReturnOrders([...mockDb.returnRequests]);
      setDispatchMessage(`Return #${updated.returnNumber} handed over to ${updated.driverName} for delivery!`);
      setTimeout(() => setDispatchMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-semibold">Outbound Fulfillment &amp; Staging</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
            Pick Lists for Customer Return Orders
          </h1>
          <p className="text-xs text-slate-500 text-pretty">
            Locate items in assigned vault bins, verify condition, pack securely, and dispatch to outbound delivery drivers.
          </p>
        </div>

        <SmartLink
          href="/warehouse"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition-colors"
        >
          <span>← Back to Dispatch Desk</span>
        </SmartLink>
      </div>

      {dispatchMessage && (
        <div role="status" aria-live="polite" className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-medium flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{dispatchMessage}</span>
          </div>
          <SmartLink href="/driver" className="underline font-bold text-emerald-800 hover:text-emerald-950">
            Check Driver Portal →
          </SmartLink>
        </div>
      )}

      <div className="space-y-6">
        {returnOrders.map((order) => {
          const isDispatched = order.driverId && order.status !== ReturnStatus.REQUESTED;
          const allPicked = order.items.every((it: any) => pickedMap[it.id]);

          return (
            <div key={order.id} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-base font-semibold text-slate-900">{order.returnNumber}</h2>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isDispatched ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Customer: <strong>{order.customerName}</strong> • Target Slot: <strong>{order.slotDate} ({order.slotTime})</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Customer Handover OTP: <span className="font-mono font-bold text-slate-900">{order.deliveryOtp}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="text-xs text-slate-600 flex items-start gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  Delivery Address: {order.address.line1}, {order.address.city} - {order.address.pincode}
                </span>
              </div>

              {/* Pick checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Vault Bin Coordinates to Retrieve ({order.items.length} items):
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Check boxes once retrieved from racks
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((it: any) => {
                    const isPicked = Boolean(pickedMap[it.id]);
                    return (
                      <label
                        key={it.id}
                        className={`cursor-pointer p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-colors duration-150 ${
                          isPicked
                            ? 'border-emerald-500 bg-emerald-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <input
                            type="checkbox"
                            checked={isPicked}
                            onChange={() => togglePicked(it.id)}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-900 text-xs truncate">{it.name}</div>
                            <div className="text-[11px] text-indigo-700 font-mono font-bold mt-0.5">
                              Bin: {it.binCode || 'B-02-R3-B4'}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">{it.qrCode}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${isPicked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {isPicked ? 'PICKED ✓' : 'TO PICK'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Handover action & Driver selection */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                {isDispatched ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Handed over to <strong>{order.driverName}</strong> for doorstep delivery</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-end">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-slate-600 font-medium whitespace-nowrap">Assign Driver:</span>
                      <select
                        value={selectedDrivers[order.id] || drivers[0].id}
                        onChange={(e) => setSelectedDrivers({ ...selectedDrivers, [order.id]: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      >
                        {drivers.map((drv) => (
                          <option key={drv.id} value={drv.id}>
                            {drv.name} ({drv.vehicleNumber})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleHandoverToDriver(order.id)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors duration-150 active:scale-[0.98]"
                    >
                      <Truck className="w-4 h-4" aria-hidden="true" />
                      <span>Handover to Driver &amp; Dispatch</span>
                    </button>
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
