'use client';

import React, { useState } from 'react';
import { mockDb } from '@lootupspace/database';
import { formatInr } from '../../../lib/utils';
import { InvoiceModal } from '../../../components/InvoiceModal';
import { Receipt, Download, Eye } from 'lucide-react';

export default function AdminPaymentsPage() {
  const invoices = mockDb.invoices;
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handleExportCsv = () => {
    const headers = ['InvoiceNumber', 'Customer', 'TaxableAmount', 'TaxAmount', 'TotalAmount', 'Status', 'Date'];
    const rows = invoices.map((i) => [
      i.invoiceNumber,
      `"${i.customerName}"`,
      i.amount,
      i.taxAmount,
      i.totalAmount,
      i.status,
      i.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lootupspace_gst_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400">Financial Reconciliation</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Payments, Razorpay Logs & GST Tax
          </h1>
          <p className="text-xs text-slate-400">
            Reconcile subscription transactions, verify 18% GST Input Tax Credits, and export tax summaries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors duration-150 border border-slate-700"
        >
          <Download className="w-4 h-4 text-lootup-400" aria-hidden="true" />
          <span>Export GST Ledger (CSV)</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-400" aria-hidden="true" />
            <h2 id="admin-invoices-heading" className="font-bold text-white text-base">Invoices ({invoices.length})</h2>
          </div>
        </div>

        <div tabIndex={0} role="region" aria-labelledby="admin-invoices-heading" className="overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="visually-hidden">Customer invoices and 18% GST tax summary</caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th scope="col" className="py-3 px-3 font-semibold">Invoice No</th>
                <th scope="col" className="py-3 px-3 font-semibold">Customer</th>
                <th scope="col" className="py-3 px-3 font-semibold">Taxable Value</th>
                <th scope="col" className="py-3 px-3 font-semibold">18% GST (CGST+SGST)</th>
                <th scope="col" className="py-3 px-3 font-semibold">Total Amount</th>
                <th scope="col" className="py-3 px-3 font-semibold">Status</th>
                <th scope="col" className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/50 transition-colors duration-150">
                  <th scope="row" className="py-3.5 px-3 font-mono font-bold text-lootup-400 text-left">{inv.invoiceNumber}</th>
                  <td className="py-3.5 px-3 font-bold text-white">{inv.customerName}</td>
                  <td className="py-3.5 px-3 font-medium text-slate-300 tabular-nums">{formatInr(inv.amount)}</td>
                  <td className="py-3.5 px-3 font-medium text-rose-300 tabular-nums">{formatInr(inv.taxAmount)}</td>
                  <td className="py-3.5 px-3 font-semibold text-white tabular-nums">{formatInr(inv.totalAmount)}</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors duration-150 flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}

