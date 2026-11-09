'use client';

import React, { useEffect, useId, useRef } from 'react';
import { X, Printer, Package } from 'lucide-react';
import { formatInr, formatDate } from '../lib/utils';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    invoiceNumber: string;
    customerName: string;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    periodStart: string;
    periodEnd: string;
    status: string;
    paidAt?: string | null;
    createdAt: string;
  } | null;
}

export function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && invoice) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen, invoice]);

  const cgst = invoice ? Math.round((invoice.taxAmount / 2) * 100) / 100 : 0;
  const sgst = cgst;

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      aria-labelledby={headingId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (isOpen) onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      {...({ closedby: 'any' } as any)}
    >
      {invoice && (
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 mx-auto">
          {/* Top actions bar */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-10">
            <h2 id={headingId} className="font-bold text-sm">Tax Invoice Preview</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close tax invoice preview"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Invoice Paper Document */}
          <div className="p-8 space-y-6 text-slate-800 text-xs sm:text-sm font-sans" id="printable-invoice">
            <div className="flex justify-between items-start pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-lootup-600 text-white flex items-center justify-center font-bold" aria-hidden="true">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-semibold text-slate-900">
                    Lootup<span className="text-accent">space</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">Lootupspace Technologies Pvt Ltd</p>
                <p className="text-xs text-slate-500">GSTIN: 29AABCL9841K1ZU</p>
                <p className="text-xs text-slate-500">SAC Code: 996729 (Warehousing &amp; Storage Services)</p>
                <p className="text-xs text-slate-500">Domlur, Old Airport Road, Bengaluru - 560071</p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full mb-2">
                  {invoice.status}
                </span>
                <h2 className="text-lg font-semibold text-slate-900">{invoice.invoiceNumber}</h2>
                <p className="text-xs text-slate-500">Date: {formatDate(invoice.createdAt)}</p>
                <p className="text-xs text-slate-500">
                  Period: {invoice.periodStart} to {invoice.periodEnd}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Billed To</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{invoice.customerName}</div>
              <div className="text-xs text-slate-600">Bengaluru, Karnataka - India</div>
              <div className="text-[11px] text-slate-500 mt-1">Place of Supply: Karnataka (State Code: 29)</div>
            </div>

            <table className="w-full text-left border-collapse">
              <caption className="visually-hidden">Tax invoice storage line items</caption>
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-600 text-xs">
                  <th scope="col" className="py-2.5 font-bold">Description</th>
                  <th scope="col" className="py-2.5 font-bold text-center">SAC Code</th>
                  <th scope="col" className="py-2.5 font-bold text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <th scope="row" className="py-3 font-normal text-left">
                    <div className="font-bold text-slate-900">Secure Personal Vault Storage Services</div>
                    <div className="text-xs text-slate-500">Storage subscription for active stored items</div>
                  </th>
                  <td className="py-3 text-center text-slate-600">996729</td>
                  <td className="py-3 text-right font-medium tabular-nums">{formatInr(invoice.amount)}</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-4 border-t border-slate-200 space-y-2 max-w-xs ml-auto text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatInr(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.0%):</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatInr(cgst)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9.0%):</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatInr(sgst)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="tabular-nums">{formatInr(invoice.totalAmount)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              This is a computer-generated tax invoice issued in accordance with Rule 46 of the CGST Rules, 2017. No physical signature is required.
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
