import React, { useState } from 'react';
import { mockDb } from '@lootupspace/database';
import { Truck } from 'lucide-react';

export default function OutboundPickListPage() {
  const [returnOrders] = useState(mockDb.returnRequests);
  const [pickedMap, setPickedMap] = useState<Record<string, boolean>>({});

  const togglePicked = (itemId: string) => {
    setPickedMap({ ...pickedMap, [itemId]: !pickedMap[itemId] });
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-indigo-600">Outbound Fulfillment</span>
        <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
          Pick Lists for Customer Return Orders
        </h1>
        <p className="text-xs text-slate-500 text-pretty">
          Retrieve items from assigned bins, scan to confirm picking, pack securely, and dispatch to driver.
        </p>
      </div>

      <div className="space-y-6">
        {returnOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-base font-semibold text-slate-900">{order.returnNumber}</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Customer: <strong>{order.customerName}</strong> • Target Slot: <strong>{order.slotDate} ({order.slotTime})</strong>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Delivery OTP: <span className="font-mono font-bold text-slate-900">{order.deliveryOtp}</span>
              </div>
            </div>

            {/* Pick checklist */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Items to Pick from Vault:
              </span>
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
                            Bin: {it.binCode || 'A-01-R1-B1'}
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

            {/* Handover action */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow transition-colors duration-150"
              >
                <Truck className="w-4 h-4" aria-hidden="true" />
                <span>Handover to Driver (Ramesh Kumar)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

