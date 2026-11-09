import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold text-lootup-600">Compliance</span>
          <h1
            id="main-content"
            tabIndex={-1}
            className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mt-1 text-balance"
          >
            Privacy Policy (DPDP Act Compliance)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Compliant with the Digital Personal Data Protection Act, 2023 (India)</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed text-pretty">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Data Fiduciary & Collection</h2>
            <p>
              Lootupspace Technologies Private Limited operates as a Data Fiduciary. We collect your mobile number, name, pickup/delivery addresses, KYC identity documents (for high-value storage), and photographs of stored goods strictly for logistics fulfillment, security audit, and tax invoice generation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Storage & Security Safeguards</h2>
            <p>
              All personal data and identity documents are stored in encrypted databases in Indian data centers. Item photographs are served using time-limited pre-signed URLs. We never sell, lease, or monetize your personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Rights of the Data Principal</h2>
            <p>
              Under the DPDP Act, you have the right to access your stored personal information, request corrections, export your data ledger, or request account erasure once all stored items have been safely returned and all dues settled.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Grievance Officer</h2>
            <p>
              In accordance with DPDP rules, you may contact our designated Grievance Officer at <strong className="text-slate-900">grievance@lootup.space</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

