import React, { useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { mockDb } from '@lootupspace/database';
import { formatInr, formatDate } from '../../../lib/utils';
import { InvoiceModal } from '../../../components/InvoiceModal';
import { FileText, CheckCircle2, Eye } from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuth();
  const [autopayEnabled, setAutopayEnabled] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const invoices = mockDb.invoices.filter(
    (i) => i.userId === (user?.id || 'user_cust_001')
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-lootup-600">Payments &amp; Compliance</span>
        <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
          Billing, Subscriptions &amp; Invoices
        </h1>
        <p className="text-xs text-slate-500 text-pretty">
          Manage your monthly storage subscription, autopay preferences, and download 18% GST tax invoices.
        </p>
      </div>

      {/* Plan Card & Autopay */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-xs font-bold text-lootup-600">Active Plan</span>
          <h2 className="text-xl font-semibold text-slate-900">Personal Storage Vault</h2>
          <p className="text-xs text-slate-500">Commitment: 6 Months (5% Discount Applied)</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Next Recurring Cycle</span>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">{formatInr(2097)}</div>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Due on 1 Dec 2026
          </span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
          <div>
            <span id="autopay-label" className="text-xs font-bold text-slate-900 block">UPI Autopay Mandate</span>
            <span className="text-[11px] text-slate-500">Zero late fees &amp; continuous insurance</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autopayEnabled}
            aria-labelledby="autopay-label"
            onClick={() => setAutopayEnabled(!autopayEnabled)}
            className={`w-12 h-6 rounded-full transition-colors duration-150 relative p-0.5 shrink-0 ${
              autopayEnabled ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform duration-150 transform ${
                autopayEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">GST Tax Invoice Ledger</h2>
            <p className="text-xs text-slate-500">HSN/SAC 996729 • Eligible for business Input Tax Credit (ITC)</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lootup-50 text-lootup-600 flex items-center justify-center shrink-0" aria-hidden="true">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{inv.invoiceNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Period: {inv.periodStart} to {inv.periodEnd} • Issued: {formatDate(inv.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <div className="font-semibold text-slate-900 text-sm tabular-nums">{formatInr(inv.totalAmount)}</div>
                  <div className="text-[10px] text-slate-500 tabular-nums">Tax: {formatInr(inv.taxAmount)} (18% GST)</div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInvoice(inv)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors duration-150 flex items-center gap-1.5 shadow"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>View Tax Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      <InvoiceModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}

