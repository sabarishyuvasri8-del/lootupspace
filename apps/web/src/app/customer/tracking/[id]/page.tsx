import React from 'react';
import { LiveTrackingMap } from '../../../../components/LiveTrackingMap';
import { mockDb } from '@lootupspace/database';
import { ArrowLeft } from 'lucide-react';
import { useParams } from '../../../../lib/navigation';
import { SmartLink } from '../../../../components/SmartLink';

export default function TrackingPage() {
  const params = useParams();
  const pickupId = params.id as string;

  const pickup = mockDb.pickupRequests.find((p) => p.id === pickupId || p.bookingNumber === pickupId) || mockDb.pickupRequests[0];

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
          <span className="text-xs font-bold text-lootup-600">Live Trip Tracking</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-semibold text-slate-900 text-balance">
            {pickup.bookingNumber}
          </h1>
        </div>
      </div>

      {/* Live tracking simulation map widget */}
      <LiveTrackingMap
        bookingNumber={pickup.bookingNumber}
        customerName={pickup.customerName}
        driverName={pickup.driverName || 'Ramesh Kumar (Pickup Lead)'}
        driverPhone={pickup.driverPhone || '+91 98765 43211'}
        driverVehicle={pickup.driverVehicleNumber ? `${pickup.driverVehicleNumber} (${pickup.driverVehicleType})` : 'KA-01-EJ-4912 (Tata Ace)'}
        status={pickup.status}
        pickupOtp={pickup.pickupOtp}
        addressText={`${pickup.address.line1}, ${pickup.address.city} - ${pickup.address.pincode}`}
      />

      {/* Items in this trip */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-sm">Items in this Collection Trip ({pickup.items.length})</h2>
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
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.qrCode || 'Barcode Pending'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

