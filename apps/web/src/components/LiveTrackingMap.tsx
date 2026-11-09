'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { PickupStatus } from '@lootupspace/shared';

interface LiveTrackingProps {
  bookingNumber: string;
  customerName: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  status: PickupStatus;
  pickupOtp: string;
  addressText: string;
}

export function LiveTrackingMap({
  bookingNumber,
  driverName = 'Ramesh Kumar (Pickup Lead)',
  driverPhone = '+91 98765 43211',
  driverVehicle = 'KA-01-EJ-4912 (Tata Ace)',
  status,
  pickupOtp
}: LiveTrackingProps) {
  const [eta, setEta] = useState(14);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (timer || document.hidden) return;
      timer = setInterval(() => {
        if (!document.hidden) {
          setEta((prev) => (prev > 2 ? prev - 1 : 2));
        }
      }, 15000);
    };

    const stopPolling = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stopPolling();
      else startPolling();
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const stages = [
    { key: PickupStatus.BOOKED, label: 'Booked' },
    { key: PickupStatus.DRIVER_ASSIGNED, label: 'Driver Assigned' },
    { key: PickupStatus.DRIVER_ON_THE_WAY, label: 'On The Way' },
    { key: PickupStatus.PICKED_UP, label: 'Picked Up' },
    { key: PickupStatus.RECEIVED_AT_WAREHOUSE, label: 'Vault Stored' }
  ];

  const currentIdx = stages.findIndex((s) => s.key === status);
  const activeIndex = currentIdx === -1 ? 2 : currentIdx;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-lootup-400">Live Pickup Dispatch</span>
          <h2 className="text-lg font-semibold">{bookingNumber}</h2>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
          <Clock className="w-4 h-4 text-accent animate-spin" aria-hidden="true" />
          <span className="text-xs font-semibold tabular-nums">ETA: ~{eta} mins</span>
        </div>
      </div>

      {/* Map visual simulator */}
      <div className="relative h-64 bg-slate-100 overflow-hidden flex items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 60 180 Q 180 80, 320 120 T 540 80"
            fill="transparent"
            stroke="#0284c7"
            strokeWidth="4"
            strokeDasharray="6 6"
          />
        </svg>

        <div className="absolute right-12 top-14 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold bg-white/95 px-2 py-0.5 rounded shadow mt-1 text-slate-800">
            Your Doorstep
          </span>
        </div>

        <div className="absolute left-1/3 top-24 flex flex-col items-center animate-bounce">
          <div className="w-10 h-10 rounded-2xl bg-lootup-600 text-white flex items-center justify-center shadow-xl ring-4 ring-lootup-200">
            <Truck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded shadow mt-1">
            {driverName.split(' ')[0]} (Tata Ace)
          </span>
        </div>
      </div>

      {/* Driver Card & Handover OTP */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-900">Pickup Handover OTP</div>
            <p className="text-xs text-amber-800 mt-0.5">Share with driver only after all items are in vehicle</p>
          </div>
          <div className="text-3xl font-semibold text-amber-950 tracking-widest bg-white px-4 py-1.5 rounded-xl border border-amber-300 shadow-sm font-mono tabular-nums">
            {pickupOtp}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg border border-slate-300" aria-hidden="true">
              {driverName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>{driverName}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                  Verified Team
                </span>
              </div>
              <div className="text-xs text-slate-500">{driverVehicle}</div>
            </div>
          </div>

          <a
            href={`tel:${driverPhone}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Call Driver (Masked)</span>
          </a>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="text-xs font-bold text-slate-600 mb-3">Booking Progress</div>
          <ol className="grid grid-cols-5 gap-1 text-center">
            {stages.map((stage, i) => {
              const isPastOrCurrent = i <= activeIndex;
              return (
                <li key={stage.key} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPastOrCurrent
                        ? 'bg-lootup-600 text-white ring-2 ring-lootup-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                    aria-hidden="true"
                  >
                    {isPastOrCurrent ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1.5 leading-tight ${isPastOrCurrent ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                    {stage.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
