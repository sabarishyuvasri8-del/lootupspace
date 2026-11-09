import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold text-lootup-600">Cancellations & Refunds</span>
          <h1
            id="main-content"
            tabIndex={-1}
            className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mt-1 text-balance"
          >
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Customer Protection Guidelines</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed text-pretty">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Pickup Cancellation</h2>
            <p>
              You may cancel or reschedule a scheduled pickup without charge up to 4 hours prior to the start of the slot window. Cancellations made less than 4 hours before the slot window attract a nominal dispatch cancellation fee of ₹99.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Storage Plan Refunds & Proration</h2>
            <p>
              Monthly recurring storage charges are billed on the 1st of each cycle. If you request return delivery of all items mid-cycle, charges for unused whole months (under 6- or 12-month commitments) are refunded after adjusting for early-exit terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Refund Processing Timelines</h2>
            <p>
              Approved refunds are credited directly back to the original payment source (UPI account or credit card via Razorpay) within 5 to 7 business days.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

