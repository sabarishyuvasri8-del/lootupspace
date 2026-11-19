import React, { useState, useEffect } from 'react';
import { LiveTrackingMap } from '../../../../components/LiveTrackingMap';
import { mockDb } from '@lootupspace/database';
import { ArrowLeft, Clock, ShieldCheck, Warehouse, Truck, CheckCircle2, MapPin } from 'lucide-react';
import { useParams } from '../../../../lib/navigation';
import { SmartLink } from '../../../../components/SmartLink';
import { PickupStatus } from '@lootupspace/shared';

export default function TrackingPage() {
  const params = useParams();
  const pickupId = params.id as string;

  const [pickup, setPickup] = useState(() => {
    return mockDb.pickupRequests.find((p) => p.id === pickupId || p.bookingNumber === pickupId) || mockDb.pickupRequests[0];
  });

  useEffect(() => {
    const handleUpdate = () => {
      const found = mockDb.pickupRequests.find((p) => p.id === pickupId || p.bookingNumber === pickupId) || mockDb.pickupRequests[0];
      setPickup({ ...found });
    };
    window.addEventListener('lootup_db_updated', handleUpdate);
    return () => window.removeEventListener('lootup_db_updated', handleUpdate);
  }, [pickupId]);

  const isPendingWarehouse = !pickup.driverId || pickup.status === PickupStatus.BOOKED;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SmartLink
          href="/customer"
          aria-label="Back to customer dashboard"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </SmartLink>
        <div>
          <span className="text-xs font-bold text-lootup-600">Doorstep Custody Tracking</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-semibold text-slate-900 text-balance">
            {pickup.bookingNumber}
          </h1>
        </div>
      </div>

      {isPendingWarehouse ? (
        /* Warehouse Triage Stage Card */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
                Step 2 of 4: Warehouse Review &amp; Driver Allocation
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                Order Received at WH-BLR-01 Indiranagar
              </h2>
              <p className="text-xs text-slate-500">
                Our warehouse shift team is inspecting item dimensions and assigning an optimal driver &amp; transit vehicle.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="text-[11px] font-mono text-slate-500">Scheduled window</span>
              <span className="text-xs font-semibold text-slate-900">{pickup.slotDate}</span>
              <span className="text-xs text-lootup-700 font-mono font-medium">{pickup.slotStartTime} - {pickup.slotEndTime}</span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Request Placed</span>
              </div>
              <p className="text-[11px] text-emerald-700">Booking confirmed</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-400 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Warehouse className="w-4 h-4 text-amber-600" />
                <span>2. Warehouse Triage</span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium">Reviewing &amp; assigning driver</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <Truck className="w-4 h-4" />
                <span>3. Driver En Route</span>
              </div>
              <p className="text-[11px]">Dispatches after review</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>4. Vault Shelving</span>
              </div>
              <p className="text-[11px]">Secure rack placement</p>
            </div>
          </div>

          {/* Handover OTP Box */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Pickup Handover Verification Code (OTP)
              </span>
              <p className="text-xs text-amber-800 mt-0.5">
                Keep this code handy. Provide it to your driver only after verifying your items into the vehicle.
              </p>
            </div>
            <div className="text-3xl font-mono font-bold text-amber-950 px-5 py-2 bg-white rounded-xl border border-amber-300 shadow-sm tracking-widest tabular-nums shrink-0">
              {pickup.pickupOtp}
            </div>
          </div>

          {/* Dispatch simulation shortcut */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Want to test the warehouse workflow? Switch to <strong>Warehouse view</strong> to inspect this order and dispatch a driver.
              </span>
            </div>
            <SmartLink
              href="/warehouse"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shrink-0 transition-colors"
            >
              Open Warehouse Desk →
            </SmartLink>
          </div>
        </div>
      ) : (
        /* Driver Assigned / Live Tracking Map Widget */
        <LiveTrackingMap
          bookingNumber={pickup.bookingNumber}
          customerName={pickup.customerName}
          driverName={pickup.driverName || 'Ramesh Kumar (Pickup Lead)'}
          driverPhone={pickup.driverPhone || '+91 98765 43211'}
          driverVehicle={pickup.driverVehicleNumber ? `${pickup.driverVehicleNumber} (${pickup.driverVehicleType || 'Mini Truck'})` : 'KA-01-EJ-4912 (Tata Ace)'}
          status={pickup.status}
          pickupOtp={pickup.pickupOtp}
          addressText={`${pickup.address.line1}, ${pickup.address.city} - ${pickup.address.pincode}`}
        />
      )}

      {/* Items in this trip */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-sm">Items in this Request ({pickup.items.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pickup.items.map((item: any, idx: number) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                <img
                  src={item.photos?.[0]?.url || item.photos?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.qrCode || 'Barcode Pending Intake'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

