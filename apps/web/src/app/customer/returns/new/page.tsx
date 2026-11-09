import React, { useId, useState, Suspense } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { mockDb } from '@lootupspace/database';
import { ReturnStatus, StorageItemStatus } from '@lootupspace/shared';
import { formatInr } from '../../../../lib/utils';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from '../../../../lib/navigation';
import { SmartLink } from '../../../../components/SmartLink';

function RequestReturnContent() {
  const searchParams = useSearchParams();
  const itemParam = searchParams.get('items');
  const preselectedIds = itemParam ? itemParam.split(',') : [];

  const { user } = useAuth();
  const customerItems = mockDb.storageItems.filter(
    (i) => i.userId === (user?.id || 'user_cust_001') && i.status === StorageItemStatus.STORED
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(
    preselectedIds.length > 0 ? preselectedIds : customerItems.slice(0, 1).map((i) => i.id)
  );

  const [slotDate, setSlotDate] = useState('2026-11-14');
  const [slotTime, setSlotTime] = useState('02:00 PM - 04:00 PM');
  const [cleaningBeforeReturn, setCleaningBeforeReturn] = useState(false);
  const [notes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returnConfirmed, setReturnConfirmed] = useState<any>(null);
  const formId = useId();
  const dateInputId = `${formId}-date`;
  const slotSelectId = `${formId}-slot`;

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const deliveryFee = 149;
  const cleaningFee = cleaningBeforeReturn ? 299 : 0;
  const totalDue = deliveryFee + cleaningFee;

  const handleConfirmReturn = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const returnNumber = `LUP-RT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

      const items = customerItems.filter((i) => selectedIds.includes(i.id));

      const newReturn = {
        id: `ret_${Date.now()}`,
        returnNumber,
        userId: user?.id || 'user_cust_001',
        customerName: user?.name || 'Aarav Sharma',
        customerPhone: user?.phone || '+919876543210',
        address: mockDb.addresses[0],
        slotDate,
        slotTime,
        status: ReturnStatus.REQUESTED,
        deliveryOtp,
        feeAmount: totalDue,
        items,
        notes,
        createdAt: new Date().toISOString()
      };

      // Mark items as return requested
      items.forEach((it) => {
        it.status = StorageItemStatus.RETURN_REQUESTED;
      });

      mockDb.returnRequests.unshift(newReturn);
      setReturnConfirmed(newReturn);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (returnConfirmed) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-6" aria-live="polite">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50" aria-hidden="true">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Return Order Scheduled
          </span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-semibold text-slate-900 mt-2 text-balance">
            Return Delivery #{returnConfirmed.returnNumber}
          </h1>
          <p className="text-xs text-slate-500 mt-1 text-pretty">
            Our team will retrieve your items from the vault and deliver them to your doorstep.
          </p>
        </div>

        {/* Handover OTP */}
        <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 text-center">
          <span className="text-xs font-bold text-amber-900 block">
            Delivery Handover Verification OTP
          </span>
          <div className="text-4xl font-mono font-semibold text-amber-950 tracking-widest my-1.5 tabular-nums">
            {returnConfirmed.deliveryOtp}
          </div>
          <span className="text-[11px] text-amber-800 text-pretty">
            Share this 4-digit code with our driver when receiving your items at your doorstep.
          </span>
        </div>

        <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Delivery Date &amp; Slot:</span>
            <span className="font-bold text-slate-900">{returnConfirmed.slotDate} ({returnConfirmed.slotTime})</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Items Being Returned:</span>
            <span className="font-bold text-slate-900">{returnConfirmed.items.length} items</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Trip Fee:</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatInr(returnConfirmed.feeAmount)}</span>
          </div>
        </div>

        <SmartLink
          href="/customer"
          className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow transition-colors duration-150"
        >
          Return to Dashboard
        </SmartLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-lootup-600">Doorstep Return</span>
        <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
          Request Return of Stored Items
        </h1>
        <p className="text-xs text-slate-500 text-pretty">
          Select whichever items you want back. Our team will pick them from the vault and deliver to your address.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items Selection */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-700">
              Select Items to Return ({selectedIds.length} chosen)
            </h2>
            <button
              type="button"
              onClick={() => setSelectedIds(customerItems.map((i) => i.id))}
              className="text-xs font-semibold text-lootup-600 hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {customerItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  className={`cursor-pointer p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-colors duration-150 ${
                    isSelected ? 'border-lootup-600 bg-lootup-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 text-lootup-600 rounded"
                    />
                    <img
                      src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500">Shelf: {item.binCode} • {item.cubicFeet} cu ft</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 shrink-0 tabular-nums">
                    {formatInr(item.monthlyStorageFeeInr)}/mo
                  </span>
                </label>
              );
            })}
          </div>

          {/* Addon: Cleaning */}
          <div className="pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={cleaningBeforeReturn}
                  onChange={(e) => setCleaningBeforeReturn(e.target.checked)}
                  className="w-4 h-4 text-lootup-600 rounded"
                />
                <div>
                  <div className="font-bold text-slate-900">Professional Dusting &amp; Sanitization</div>
                  <div className="text-[11px] text-slate-500">Steam cleaned and wiped before dispatch</div>
                </div>
              </div>
              <span className="font-bold text-slate-800 tabular-nums">+₹299</span>
            </label>
          </div>
        </div>

        {/* Right: Slot and Confirm */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
          <h2 className="font-bold text-slate-900 text-sm">Delivery Slot &amp; Summary</h2>

          {/* Slot picker */}
          <div className="space-y-3">
            <div>
              <label htmlFor={dateInputId} className="block text-xs font-semibold text-slate-700 mb-1">Delivery Date</label>
              <input
                id={dateInputId}
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
              />
            </div>

            <div>
              <label htmlFor={slotSelectId} className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
              <select
                id={slotSelectId}
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
              >
                <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="04:00 PM - 06:00 PM">Evening (04:00 PM - 06:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
            <div className="flex justify-between">
              <span>Delivery Trip Fee:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatInr(deliveryFee)}</span>
            </div>
            {cleaningBeforeReturn && (
              <div className="flex justify-between">
                <span>Sanitization Service:</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatInr(cleaningFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-slate-900 text-sm pt-2 border-t border-slate-200">
              <span>Total Delivery Charge:</span>
              <span className="tabular-nums">{formatInr(totalDue)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting || selectedIds.length === 0}
            onClick={handleConfirmReturn}
            className="w-full py-4 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-xl shadow-accent/25 transition-colors duration-150 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>{isSubmitting ? 'Scheduling Delivery...' : `Confirm Return (${selectedIds.length} Items)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RequestReturnPage() {
  return (
    <Suspense fallback={<div role="status" className="p-12 text-center text-slate-500">Loading return scheduler...</div>}>
      <RequestReturnContent />
    </Suspense>
  );
}
