import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function StorageAgreementPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold text-lootup-600">Bailment & Storage</span>
          <h1
            id="main-content"
            tabIndex={-1}
            className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mt-1 text-balance"
          >
            Storage Agreement & Lien Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Indian Contract Act, 1872 (Bailment Provisions)</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed text-pretty">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Nature of the Relationship (Bailment)</h2>
            <p>
              The customer acts as the Bailor and Lootupspace acts as the Bailee for hire under Chapter IX of the Indian Contract Act, 1872. Lootupspace undertakes reasonable care of the bailed goods as an ordinary prudent person would exercise under similar circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Right of Particular Lien (Section 170)</h2>
            <p>
              Lootupspace holds a general and particular possessory lien on all stored items for unpaid storage charges, transportation fees, handling charges, and accrued interest. No items will be released or returned until all overdue balances are paid in full.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Prolonged Non-Payment & Auction Protocol</h2>
            <p>
              If storage charges remain unpaid for more than 90 consecutive days despite multiple electronic notices (SMS, WhatsApp, registered email), Lootupspace reserves the legal right, following a formal 30-day registered statutory legal notice, to auction or dispose of the goods to recover outstanding costs. Any excess proceeds will be credited to the customer&apos;s verified bank account.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

