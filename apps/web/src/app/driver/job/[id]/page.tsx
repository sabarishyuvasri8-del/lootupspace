import React, { useId, useState, Suspense } from 'react';
import { mockDb } from '@lootupspace/database';
import { PickupStatus, ReturnStatus, StorageItemStatus } from '@lootupspace/shared';
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  FileSignature
} from 'lucide-react';
import { useParams, useSearchParams } from '../../../../lib/navigation';
import { SmartLink } from '../../../../components/SmartLink';

function DriverJobDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobType = searchParams.get('type') || 'pickup';
  const jobId = params.id as string;
  const otpId = useId();

  const isPickup = jobType === 'pickup';
  const pickup = mockDb.pickupRequests.find((p) => p.id === jobId) || mockDb.pickupRequests[0];
  const returnReq = mockDb.returnRequests.find((r) => r.id === jobId) || mockDb.returnRequests[0];

  const currentJob = isPickup ? pickup : returnReq;

  const [verifiedItemIds, setVerifiedItemIds] = useState<string[]>(
    currentJob.items.map((i: any) => i.id)
  );
  const [enteredOtp, setEnteredOtp] = useState(isPickup ? pickup.pickupOtp : returnReq.deliveryOtp);
  const [proofPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const toggleItemVerify = (id: string) => {
    if (verifiedItemIds.includes(id)) {
      setVerifiedItemIds(verifiedItemIds.filter((i) => i !== id));
    } else {
      setVerifiedItemIds([...verifiedItemIds, id]);
    }
  };

  const handleCompleteHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifiedItemIds.length === 0) {
      setError('Please verify and tick off all collected items');
      return;
    }
    if (!enteredOtp || enteredOtp.length !== 4) {
      setError('Please collect and enter the 4-digit handover OTP from the customer');
      return;
    }

    setIsCompleting(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (isPickup) {
        pickup.status = PickupStatus.PICKED_UP;
        pickup.items.forEach((item: any) => {
          const dbIt = mockDb.storageItems.find((i) => i.id === item.id);
          if (dbIt) dbIt.status = StorageItemStatus.IN_TRANSIT_TO_WAREHOUSE;
        });
      } else {
        returnReq.status = ReturnStatus.DELIVERED;
        returnReq.items.forEach((item: any) => {
          const dbIt = mockDb.storageItems.find((i) => i.id === item.id);
          if (dbIt) {
            dbIt.status = StorageItemStatus.RETURNED;
            dbIt.binCode = null;
          }
        });
      }

      setCompleted(true);
    } catch (err: any) {
      setError(err.message || 'Handover verification failed');
    } finally {
      setIsCompleting(false);
    }
  };

  if (completed) {
    return (
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center space-y-5" aria-live="polite">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto" aria-hidden="true">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h1 id="main-content" tabIndex={-1} className="text-xl font-semibold text-white text-balance">
            Handover Verified &amp; Logged!
          </h1>
          <p className="text-xs text-slate-300 mt-1 text-pretty">
            {isPickup
              ? 'Items are in your vehicle and marked In-Transit. Proceed to Indiranagar Warehouse Hub.'
              : 'Delivery complete! Return status updated.'}
          </p>
        </div>
        <SmartLink
          href="/driver"
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow inline-flex items-center justify-center transition-colors duration-150"
        >
          Return to Jobs List
        </SmartLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SmartLink
          href="/driver"
          aria-label="Return to driver jobs list"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </SmartLink>
        <div>
          <span className="text-[10px] font-bold text-amber-400 block">
            {isPickup ? 'Doorstep Pickup Verification' : 'Return Delivery Verification'}
          </span>
          <h1 id="main-content" tabIndex={-1} className="text-lg font-semibold text-white text-balance">
            {currentJob.bookingNumber || currentJob.returnNumber}
          </h1>
        </div>
      </div>

      <form onSubmit={handleCompleteHandover} className="space-y-4">
        {error && (
          <div role="alert" className="p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Customer & Call Banner */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-white">{currentJob.customerName}</h2>
            <div className="text-[11px] text-slate-400">{currentJob.address.line1}</div>
          </div>
          <a
            href={`tel:${currentJob.customerPhone}`}
            className="px-3 py-1.5 rounded-xl bg-slate-700 text-lootup-400 text-xs font-bold flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Call</span>
          </a>
        </div>

        {/* 1. Item Verification Checklist */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-300">
              1. Item Checklist ({verifiedItemIds.length}/{currentJob.items.length} Checked)
            </h2>
            <span className="text-[10px] text-slate-400">Tick off after inspecting</span>
          </div>

          <div className="space-y-2">
            {currentJob.items.map((it: any) => {
              const isChecked = verifiedItemIds.includes(it.id);
              return (
                <label
                  key={it.id}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-colors duration-150 ${
                    isChecked
                      ? 'border-amber-500/80 bg-amber-500/10'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItemVerify(it.id)}
                      className="w-4 h-4 text-amber-500 rounded bg-slate-900 border-slate-700"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{it.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{it.qrCode || 'Barcode Pending'} • {it.sizeTier}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 shrink-0">
                    {isChecked ? 'VERIFIED' : 'PENDING'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 2. Photo Proof of Loading */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
          <h2 className="text-xs font-bold text-slate-300 block">
            2. Photo Proof of Packed Goods in Vehicle
          </h2>
          <div className="h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 relative">
            <img
              src={proofPhotoUrl}
              alt="Packed goods loaded in vehicle"
              width={600}
              height={256}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">
              GPS &amp; Timestamp Tagged
            </span>
          </div>
        </div>

        {/* 3. Customer Handover OTP Input */}
        <div className="bg-slate-800 p-4 rounded-2xl border-2 border-amber-500/50 space-y-2">
          <label htmlFor={otpId} className="block text-xs font-bold text-amber-400">
            3. Customer Handover 4-Digit OTP
          </label>
          <p className="text-[11px] text-slate-400">Ask the customer to share the 4-digit OTP shown in their app.</p>
          <input
            id={otpId}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={4}
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            className="w-full text-center text-3xl font-mono tracking-widest py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-2 focus:outline-transparent"
            placeholder="0000"
          />
        </div>

        {/* 4. Digital Signature pad confirmation */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-lootup-400" aria-hidden="true" />
            <div>
              <div className="font-bold text-white">Customer Digital Signature</div>
              <div className="text-[10px] text-slate-400">Collected on mobile touch-screen</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
            CAPTURED ✓
          </span>
        </div>

        <button
          type="submit"
          disabled={isCompleting}
          className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-xl transition-colors duration-150 active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          <span>{isCompleting ? 'Verifying...' : 'Confirm Handover & Start Transit'}</span>
        </button>
      </form>
    </div>
  );
}

export default function DriverJobDetailPage() {
  return (
    <Suspense fallback={<div role="status" className="p-8 text-center text-slate-400">Loading job verification...</div>}>
      <DriverJobDetailContent />
    </Suspense>
  );
}
