import React from 'react';
import { useAuth } from '../../lib/auth-context';
import { mockDb } from '@lootupspace/database';
import { StorageItemStatus, PickupStatus } from '@lootupspace/shared';
import { formatInr } from '../../lib/utils';
import { SmartLink } from '../../components/SmartLink';
import {
  Package,
  PlusCircle,
  RotateCcw,
  Truck,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Shirt,
  Armchair,
  Tv,
  BookOpen,
  Bike,
  FileText
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  const customerItems = mockDb.storageItems.filter(
    (i) => i.userId === (user?.id || 'user_cust_001')
  );

  const storedItems = customerItems.filter((i) => i.status === StorageItemStatus.STORED);
  const totalCuFt = storedItems.reduce((acc, it) => acc + (it.cubicFeet || 2.0), 0);
  const monthlyCost = storedItems.reduce((acc, it) => acc + (it.monthlyStorageFeeInr || 399), 0);

  const activePickup = mockDb.pickupRequests.find(
    (p) => p.userId === (user?.id || 'user_cust_001') && p.status !== PickupStatus.RECEIVED_AT_WAREHOUSE
  );

  const quickCategories = [
    { label: 'Clothes', category: 'CLOTHES', icon: Shirt, desc: 'Winter wear, quilts' },
    { label: 'Furniture', category: 'FURNITURE', icon: Armchair, desc: 'Desks, chairs, frames' },
    { label: 'Appliances', category: 'APPLIANCES', icon: Tv, desc: 'Electronics & screens' },
    { label: 'Books', category: 'BOOKS', icon: BookOpen, desc: 'Libraries & volumes' },
    { label: 'Sports gear', category: 'SPORTS_FITNESS', icon: Bike, desc: 'Cycles & equipment' },
    { label: 'Documents', category: 'DOCUMENTS', icon: FileText, desc: 'Archived files & records' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-mono text-slate-500">Customer vault · BLR-01</div>
            <h1 id="main-content" tabIndex={-1} className="text-2xl font-medium text-slate-950 tracking-tight mt-0.5 text-balance">
              Storage overview
            </h1>
            <p className="text-xs text-slate-500 mt-1 text-pretty">
              Active custody at Bengaluru Indiranagar Fulfillment Center.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <SmartLink
              href="/customer/items/new"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              <span>Schedule pickup</span>
            </SmartLink>
            <SmartLink
              href="/customer/inventory"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 transition-colors duration-150"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              <span>Request return</span>
            </SmartLink>
          </div>
        </div>

        {/* Metric Figures */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-slate-500">Stored items</div>
            <div className="text-2xl font-mono font-medium text-slate-950 mt-1 tabular-nums">
              {storedItems.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">In active custody</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Vault volume</div>
            <div className="text-2xl font-mono font-medium text-slate-950 mt-1 tabular-nums">
              {totalCuFt.toFixed(1)} <span className="text-xs font-normal text-slate-500">cu ft</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">Billed on volume</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Monthly storage</div>
            <div className="text-2xl font-mono font-medium text-slate-950 mt-1 tabular-nums">
              {formatInr(monthlyCost)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-mono">Autopay active</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Next billing</div>
            <div className="text-2xl font-mono font-medium text-slate-950 mt-1 tabular-nums">
              1 Dec 2026
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">GST tax invoice</div>
          </div>
        </div>
      </div>

      {/* Active Pickup Notice */}
      {activePickup && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0" aria-hidden="true">
              <Truck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                  Pickup scheduled
                </span>
                <span className="text-xs font-mono text-slate-700">{activePickup.bookingNumber}</span>
              </div>
              <div className="text-xs font-medium text-slate-900 mt-1">
                Driver assigned: {activePickup.driverName}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Slot: {activePickup.slotDate} ({activePickup.slotStartTime} - {activePickup.slotEndTime}) · Handover OTP: <span className="font-mono font-medium text-slate-900">{activePickup.pickupOtp}</span>
              </div>
            </div>
          </div>

          <SmartLink
            href={`/customer/tracking/${activePickup.id}`}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors duration-150 inline-flex items-center gap-1.5"
          >
            <span>Live route tracking</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          </SmartLink>
        </div>
      )}

      {/* Category Shortcuts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-900">Add items by category</h2>
          <span className="text-xs text-slate-500 font-mono">Standard box tiers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickCategories.map((tile) => {
            const Icon = tile.icon;
            return (
              <SmartLink
                key={tile.category}
                href={`/customer/items/new?category=${tile.category}`}
                className="bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors duration-150 text-left space-y-2 block"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700" aria-hidden="true">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-900">{tile.label}</div>
                  <div className="text-[11px] text-slate-500 truncate">{tile.desc}</div>
                </div>
              </SmartLink>
            );
          })}
        </div>
      </div>

      {/* Stored Inventory Highlights */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-medium text-slate-900">Stored items in vault</h2>
            <p className="text-xs text-slate-500">Individually tagged and shelved</p>
          </div>
          <SmartLink
            href="/customer/inventory"
            className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <span>View all ({storedItems.length})</span>
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          </SmartLink>
        </div>

        {storedItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Package className="w-8 h-8 mx-auto text-slate-300" strokeWidth={1.5} aria-hidden="true" />
            <div className="text-xs font-medium text-slate-600">No items currently stored</div>
            <SmartLink
              href="/customer/items/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium"
            >
              Schedule first pickup
            </SmartLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {storedItems.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200/80 p-3.5 space-y-3 bg-white">
                <div className="h-32 rounded bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    width={400}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {item.qrCode}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-900 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                    <span className="font-mono">Shelf: {item.binCode}</span>
                    <span className="font-mono text-slate-900 tabular-nums">{formatInr(item.monthlyStorageFeeInr)}/mo</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" strokeWidth={1.5} aria-hidden="true" />
                    Insured
                  </span>
                  <SmartLink
                    href={`/customer/inventory?item=${item.id}`}
                    className="text-slate-700 hover:text-slate-950 font-medium text-[11px]"
                  >
                    View details
                  </SmartLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
