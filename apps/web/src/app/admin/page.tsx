'use client';

import React from 'react';
import { mockDb } from '@lootupspace/database';
import { formatInr } from '../../lib/utils';
import { SmartLink } from '../../components/SmartLink';
import {
  Truck,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const totalCustomers = mockDb.users.filter((u) => u.role === 'CUSTOMER').length;

  const mrr = mockDb.storageItems
    .filter((i) => i.status === 'STORED')
    .reduce((sum, item) => sum + (item.monthlyStorageFeeInr || 399), 0);

  const totalRevenue = mockDb.invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pickupsToday = mockDb.pickupRequests.length;
  const pendingReturns = mockDb.returnRequests.filter((r) => r.status === 'REQUESTED').length;
  const overdueInvoices = mockDb.invoices.filter((inv) => inv.status === 'OVERDUE').length;

  const revenueMonthlyTrend = [
    { month: 'Jun', rev: 142000, mrr: 120000 },
    { month: 'Jul', rev: 198000, mrr: 165000 },
    { month: 'Aug', rev: 265000, mrr: 215000 },
    { month: 'Sep', rev: 340000, mrr: 290000 },
    { month: 'Oct', rev: 425000, mrr: 380000 },
    { month: 'Nov', rev: 512000, mrr: 460000, current: true }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-slate-500">Operational telemetry</div>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-medium text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Platform KPI overview
          </h1>
          <p className="text-xs text-slate-400">
            Fulfillment telemetry across Bengaluru, Mumbai, and Chennai hubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
            All 3 hubs operational
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Monthly recurring revenue</div>
          <div className="text-2xl font-mono font-medium text-white tabular-nums">{formatInr(mrr)}</div>
          <div className="text-[11px] text-emerald-400 font-mono">+18.4% vs last month</div>
        </div>

        {/* Total Collected Revenue */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Total revenue (FY26)</div>
          <div className="text-2xl font-mono font-medium text-white tabular-nums">{formatInr(totalRevenue)}</div>
          <div className="text-[11px] text-slate-500 font-mono">18% GST itemized</div>
        </div>

        {/* Warehouse Occupancy */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Warehouse utilization</div>
          <div className="text-2xl font-mono font-medium text-white tabular-nums">36.5%</div>
          <div className="text-[11px] text-slate-500 font-mono">18,240 / 50,000 cu ft</div>
        </div>

        {/* Active Customers */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Active subscribers</div>
          <div className="text-2xl font-mono font-medium text-white tabular-nums">{totalCustomers}</div>
          <div className="text-[11px] text-emerald-400 font-mono">Monthly churn &lt; 1.2%</div>
        </div>
      </div>

      {/* Operational Dispatch Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center" aria-hidden="true">
              <Truck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs text-slate-400">Pickups scheduled today</div>
              <div className="text-base font-mono font-medium text-white tabular-nums">{pickupsToday} trips</div>
            </div>
          </div>
          <SmartLink href="/admin/orders" aria-label="Dispatch pickups" className="text-xs text-slate-400 hover:text-white font-mono">
            Dispatch →
          </SmartLink>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center" aria-hidden="true">
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs text-slate-400">Pending return deliveries</div>
              <div className="text-base font-mono font-medium text-white tabular-nums">{pendingReturns} orders</div>
            </div>
          </div>
          <SmartLink href="/admin/orders" aria-label="Review return pick list" className="text-xs text-slate-400 hover:text-white font-mono">
            Pick list →
          </SmartLink>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center" aria-hidden="true">
              <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs text-slate-400">Overdue invoices (grace 7d)</div>
              <div className="text-base font-mono font-medium text-white tabular-nums">{overdueInvoices} invoices</div>
            </div>
          </div>
          <SmartLink href="/admin/payments" aria-label="Review overdue invoices" className="text-xs text-slate-400 hover:text-white font-mono">
            Review →
          </SmartLink>
        </div>
      </div>

      {/* Revenue & Growth Visualization */}
      <div className="bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <h2 className="font-medium text-white text-sm">Monthly recurring revenue growth</h2>
            <p className="text-xs text-slate-400">Compounded monthly volume commitments</p>
          </div>
          <div className="text-xs font-mono text-slate-500">Trailing 6 months</div>
        </div>

        {/* Minimal Bar Chart */}
        <div className="grid grid-cols-6 gap-3 items-end h-44 pt-4 border-b border-slate-800/80 pb-2">
          {revenueMonthlyTrend.map((item, idx) => {
            const heightPercent = Math.round((item.mrr / 500000) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 font-mono tabular-nums">
                  {formatInr(item.mrr)}
                </div>
                <div
                  className={`w-full rounded-t transition-colors duration-150 ${
                    item.current ? 'bg-white' : 'bg-slate-700 group-hover:bg-slate-600'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-mono text-slate-400">{item.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>₹1.2L baseline (Jun)</span>
          <span>Current run-rate: ₹4.6L / month</span>
        </div>
      </div>
    </div>
  );
}
