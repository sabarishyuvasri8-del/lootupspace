import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold text-lootup-600">Legal Terms</span>
          <h1
            id="main-content"
            tabIndex={-1}
            className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mt-1 text-balance"
          >
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: November 2026 • Governing Law: Republic of India</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed text-pretty">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing the Lootupspace web application, scheduling a doorstep pickup, or storing belongings in our hubs, you agree to be bound by these Terms of Service, the Storage Agreement, and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Customer Obligations & Declarations</h2>
            <p>
              The customer affirms that all stored items are their legal property or that they possess full authorization to store them. Storing illegal goods, contraband, hazardous chemicals, explosives, perishables, or currency exceeding ₹50,000 is strictly prohibited and constitutes grounds for immediate termination and referral to law enforcement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Monthly Billing, Grace Period & Early Exit</h2>
            <p>
              Storage fees are billed monthly in advance based on the space occupied. Customers commit to an initial minimum period (default 3 months). Early exit prior to commitment completion incurs an early-exit charge equal to one month&apos;s storage fee. Invoices unpaid after a 7-day grace period attract 2% monthly late interest.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Dispute Resolution & Jurisdiction</h2>
            <p>
              Any disputes arising under these terms shall be settled by arbitration in Bengaluru, Karnataka under the Arbitration and Conciliation Act, 1996, in English. Courts in Bengaluru shall exercise exclusive jurisdiction.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

