import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { usePickupCart } from '../../../../lib/store';
import { mockDb } from '@lootupspace/database';
import { calculateStoragePrice, PickupStatus } from '@lootupspace/shared';
import { formatInr } from '../../../../lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck
} from 'lucide-react';
import { SmartLink } from '../../../../components/SmartLink';

export default function SchedulePickupCheckoutPage() {
  const { user } = useAuth();
  const {
    cartItems,
    commitmentMonths,
    setCommitmentMonths,
    priorityPickup,
    packingMaterials,
    insuranceTierId,
    clearCart
  } = usePickupCart();

  // If cart is empty, use sample items from inventory so testing is seamless!
  const itemsToSchedule = useMemo(() => {
    if (cartItems.length > 0) return cartItems;
    return mockDb.storageItems.slice(0, 2);
  }, [cartItems]);

  const [slotDate, setSlotDate] = useState('2026-11-12');
  const [slotTime, setSlotTime] = useState('10:00 AM - 12:00 PM');
  const [couponCode] = useState('WELCOME100');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  const availableSlots = [
    { time: '10:00 AM - 12:00 PM', available: true, capacity: 'High' },
    { time: '02:00 PM - 04:00 PM', available: true, capacity: 'Moderate' },
    { time: '04:00 PM - 06:00 PM', available: true, capacity: 'Fast Filling' },
    { time: '06:00 PM - 08:00 PM', available: true, capacity: 'Available' }
  ];

  // Pricing calculation
  const pricing = useMemo(() => {
    return calculateStoragePrice({
      items: itemsToSchedule.map((i) => ({
        sizeTier: i.sizeTier,
        length: i.length,
        width: i.width,
        height: i.height,
        unit: i.unit,
        quantity: i.quantity || 1,
        packingRequired: i.packingRequired,
        materialsRequired: packingMaterials
      })),
      commitmentMonths,
      priorityPickup,
      insuranceTierId,
      couponCode
    });
  }, [itemsToSchedule, commitmentMonths, priorityPickup, packingMaterials, insuranceTierId, couponCode]);

  const handlePayAndConfirm = async () => {
    setIsProcessing(true);

    try {
      // Simulate Razorpay checkout
      await new Promise((resolve) => setTimeout(resolve, 800));

      const bookingNumber = `LUP-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

      const newBooking = {
        id: `pk_${Date.now()}`,
        bookingNumber,
        userId: user?.id || 'user_cust_001',
        customerName: user?.name || 'Aarav Sharma',
        customerPhone: user?.phone || '+919876543210',
        address: mockDb.addresses[0],
        slotDate,
        slotStartTime: slotTime.split(' - ')[0],
        slotEndTime: slotTime.split(' - ')[1],
        status: PickupStatus.BOOKED,
        driverId: mockDb.drivers[0]?.id,
        driverName: 'Ramesh Kumar (Pickup Lead)',
        driverPhone: '+919876543211',
        driverVehicleNumber: 'KA-01-EJ-4912',
        pickupOtp,
        totalAmount: pricing.totalDueToday,
        monthlyStorage: pricing.monthlyRecurringTotal,
        commitmentMonths,
        items: itemsToSchedule,
        createdAt: new Date().toISOString()
      };

      mockDb.pickupRequests.unshift(newBooking);
      clearCart();
      setBookingConfirmed(newBooking);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-6" aria-live="polite">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50" aria-hidden="true">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Booking Confirmed
          </span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-semibold text-slate-900 mt-2 text-balance">
            Pickup #{bookingConfirmed.bookingNumber} Scheduled!
          </h1>
          <p className="text-xs text-slate-500 mt-1 text-pretty">
            Confirmation sent via WhatsApp &amp; SMS to {bookingConfirmed.customerPhone}
          </p>
        </div>

        {/* Handover OTP Card */}
        <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 text-center">
          <span className="text-xs font-bold text-amber-900 block">
            Pickup Handover Verification OTP
          </span>
          <div className="text-4xl font-mono font-semibold text-amber-950 tracking-widest my-1.5 tabular-nums">
            {bookingConfirmed.pickupOtp}
          </div>
          <span className="text-[11px] text-amber-800 text-pretty">
            Share this 4-digit code with driver Ramesh only after your items are verified into the vehicle.
          </span>
        </div>

        <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Pickup Date &amp; Slot:</span>
            <span className="font-bold text-slate-900">{bookingConfirmed.slotDate} ({bookingConfirmed.slotStartTime} - {bookingConfirmed.slotEndTime})</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Assigned Driver:</span>
            <span className="font-bold text-slate-900">{bookingConfirmed.driverName} ({bookingConfirmed.driverVehicleNumber})</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Amount Paid (1st Month + Pickup + GST):</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatInr(bookingConfirmed.totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <SmartLink
            href={`/customer/tracking/${bookingConfirmed.id}`}
            className="flex-1 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors duration-150"
          >
            <Truck className="w-4 h-4" aria-hidden="true" />
            <span>Track Pickup Live</span>
          </SmartLink>
          <SmartLink
            href="/customer"
            className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center transition-colors duration-150"
          >
            <span>Back to Dashboard</span>
          </SmartLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-lootup-600">Step 2 of 2</span>
        <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
          Schedule Doorstep Pickup &amp; Checkout
        </h1>
        <p className="text-xs text-slate-500 text-pretty">
          Review your items, choose a driver slot, and confirm recurring storage commitment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Address, Slots, Commitment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Address Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-lootup-600" aria-hidden="true" />
                <span>1. Doorstep Pickup Address</span>
              </h2>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Serviceable Metro Zone
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-lootup-600 bg-lootup-50/50 space-y-1">
              <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                <span>{mockDb.addresses[0].label}</span>
                <span className="text-[10px] bg-lootup-200 text-lootup-900 px-2 py-0.5 rounded font-bold">Default</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {mockDb.addresses[0].line1}, {mockDb.addresses[0].line2}
              </p>
              <p className="text-[11px] text-slate-500">
                Landmark: {mockDb.addresses[0].landmark} • {mockDb.addresses[0].city} - {mockDb.addresses[0].pincode}
              </p>
            </div>
          </div>

          {/* 2. Date & Time Slot Picker */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-lootup-600" aria-hidden="true" />
              <span>2. Pickup Date &amp; 2-Hour Window</span>
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {[
                { date: '2026-11-12', label: 'Tomorrow', sub: '12 Nov' },
                { date: '2026-11-13', label: 'Friday', sub: '13 Nov' },
                { date: '2026-11-14', label: 'Saturday', sub: '14 Nov' }
              ].map((d) => (
                <button
                  key={d.date}
                  type="button"
                  aria-pressed={slotDate === d.date}
                  onClick={() => setSlotDate(d.date)}
                  className={`cursor-pointer p-3 rounded-2xl border-2 text-center transition-colors duration-150 ${
                    slotDate === d.date
                      ? 'border-lootup-600 bg-lootup-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{d.label}</div>
                  <div className="text-[10px] text-slate-500">{d.sub}</div>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-600 block">Select Available 2-Hour Time Slot:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = slotTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSlotTime(slot.time)}
                      className={`cursor-pointer p-3 rounded-xl border-2 flex items-center justify-between transition-colors duration-150 text-left ${
                        isSelected
                          ? 'border-lootup-600 bg-lootup-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-lootup-600' : 'text-slate-400'}`} aria-hidden="true" />
                        <span className="text-xs font-bold text-slate-900">{slot.time}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{slot.capacity}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Commitment Discount */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-700 block">
              3. Commitment Term &amp; Discount
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { months: 3, discount: '0%', tag: 'Standard' },
                { months: 6, discount: '5% OFF', tag: 'Recommended', highlight: true },
                { months: 12, discount: '10% OFF', tag: 'Best Value' }
              ].map((opt) => (
                <button
                  key={opt.months}
                  type="button"
                  aria-pressed={commitmentMonths === opt.months}
                  onClick={() => setCommitmentMonths(opt.months as 3 | 6 | 12)}
                  className={`cursor-pointer p-3 rounded-2xl border-2 text-center transition-colors duration-150 ${
                    commitmentMonths === opt.months
                      ? 'border-lootup-600 bg-lootup-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{opt.months} Months</div>
                  <div className="text-xs font-semibold text-emerald-700">{opt.discount}</div>
                  <span className="text-[10px] font-bold text-slate-500 mt-0.5 block">{opt.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Items Review & Razorpay Checkout */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm">Booking Overview ({itemsToSchedule.length} Items)</h2>
          </div>

          {/* Items mini list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {itemsToSchedule.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{item.name}</span>
                <span className="font-bold text-slate-900 tabular-nums">{formatInr(item.monthlyStorageFeeInr || 399)}/mo</span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
            <div className="flex justify-between">
              <span>Monthly Storage Fee:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatInr(pricing.monthlyStorageSubtotal)}</span>
            </div>

            {pricing.commitmentDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Commitment Discount ({pricing.commitmentDiscountPercent}%):</span>
                <span className="tabular-nums">-{formatInr(pricing.commitmentDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Doorstep Pickup Charge:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatInr(pricing.pickupFee)}</span>
            </div>

            {pricing.couponDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon (WELCOME100):</span>
                <span className="tabular-nums">-{formatInr(pricing.couponDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500 pt-1">
              <span>GST (18% ITC Eligible):</span>
              <span className="tabular-nums">{formatInr(pricing.oneTimeGst + pricing.monthlyRecurringGst)}</span>
            </div>
          </div>

          {/* Total & Checkout */}
          <div className="pt-4 border-t-2 border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">Due Now</span>
                <span className="text-[10px] text-slate-500">Includes 1st month + pickup + GST</span>
              </div>
              <span className="text-3xl font-semibold text-slate-900 tabular-nums">{formatInr(pricing.totalDueToday)}</span>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayAndConfirm}
              className="w-full py-4 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-sm shadow-xl shadow-accent/25 transition-colors duration-150 active:scale-95 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" aria-hidden="true" />
              <span>{isProcessing ? 'Processing Razorpay Order...' : `Pay ${formatInr(pricing.totalDueToday)} & Schedule`}</span>
            </button>

            <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span>Razorpay 256-Bit SSL Encrypted • Autopay Mandate setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

