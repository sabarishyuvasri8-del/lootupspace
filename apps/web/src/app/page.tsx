import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { PincodeChecker } from '../components/PincodeChecker';
import { VaultInteractivePreview } from '../components/VaultInteractivePreview';
import { SmartLink } from '../components/SmartLink';
import {
  Package,
  Camera,
  Truck,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Thermometer,
  Sparkles,
  FileText
} from 'lucide-react';

// Code-split heavy below-the-fold sections to minimize initial bundle & expedite LCP
const SpaceRecoveryCalculator = lazy(() =>
  import('../components/SpaceRecoveryCalculator').then((m) => ({ default: m.SpaceRecoveryCalculator }))
);
const StorageComparison = lazy(() =>
  import('../components/StorageComparison').then((m) => ({ default: m.StorageComparison }))
);
const PricingCalculator = lazy(() =>
  import('../components/PricingCalculator').then((m) => ({ default: m.PricingCalculator }))
);
const CityHubsInteractive = lazy(() =>
  import('../components/CityHubsInteractive').then((m) => ({ default: m.CityHubsInteractive }))
);
const RealCustomerStories = lazy(() =>
  import('../components/RealCustomerStories').then((m) => ({ default: m.RealCustomerStories }))
);
const Footer = lazy(() =>
  import('../components/Footer').then((m) => ({ default: m.Footer }))
);

function SectionPlaceholder({ heightClass }: { heightClass: string }) {
  return <div className={`${heightClass} w-full rounded-2xl bg-slate-200/40 animate-pulse`} aria-hidden="true" />;
}

const FAQS = [
  {
    q: 'What is the minimum storage commitment?',
    a: 'The standard minimum commitment is 3 months. After 3 months, your plan automatically transitions to month-to-month billing with no lock-in. Longer upfront commitments of 6 months (5% discount) and 12 months (10% discount) are also available.'
  },
  {
    q: 'What physical security measures protect my stored items?',
    a: 'All Lootupspace facilities feature 24/7 continuous CCTV coverage with 90-day offsite recording, biometric access gates, fire suppression systems, active dehumidification (<55% RH), and barcode automated reconciliation. Vault bays are strictly closed to walk-in public access.'
  },
  {
    q: 'Can I retrieve just one single item instead of everything?',
    a: 'Yes! That is the core advantage of Lootupspace. Every single carton, appliance, or furniture item receives an individual QR barcode and bin coordinate. You can request return of any specific item through your inventory screen, and our driver delivers it within 24 to 48 hours.'
  },
  {
    q: 'Are packing materials provided by Lootupspace?',
    a: 'Yes. If you request packing materials during booking, our captain brings heavy-duty double-wall corrugated cartons (specifically sized for books, clothes, or appliances), bubble wrap, and tamper-evident security tape.'
  },
  {
    q: 'What items cannot be stored?',
    a: 'We do not accept perishable food items, hazardous chemicals or flammable goods, pressurized gas canisters, live animals or plants, firearms, illegal contraband, or jewelry and loose cash above declared insurance limits.'
  },
  {
    q: 'Are GST tax invoices provided for businesses and startups?',
    a: 'Yes. All invoices detail the 18% GST calculation under SAC code 996729 and can be downloaded as official PDF tax invoices from your billing tab for complete input tax credit (ITC) claims.'
  }
];

export default function HomePage() {
  const firstFaqRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (firstFaqRef.current && !firstFaqRef.current.hasAttribute('open')) {
      firstFaqRef.current.setAttribute('open', '');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-lootup-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION (Above the fold — never apply content-visibility: auto)
            ========================================================================= */}
        <section className="relative border-b border-slate-200/80 bg-white pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            aria-hidden="true"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Left Column: Core Value Proposition */}
              <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-mono text-slate-700 shadow-xs">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Active in Bengaluru · Mumbai · Chennai</span>
                  <span className="text-slate-400" aria-hidden="true">|</span>
                  <span className="text-slate-600">Pickups today: 28</span>
                </div>

                <h1
                  id="main-content"
                  tabIndex={-1}
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-slate-950 leading-[1.08] text-balance"
                >
                  Recover your <br />
                  <span className="text-slate-900">apartment space.</span>
                </h1>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl text-pretty">
                  Flat rent in metro cities is too expensive to use for storing unused suitcases, winter quilts, extra desks, and seasonal clothes. We collect at your door, catalog every item with tamper barcodes, and hold it in climate vaults from <strong className="text-slate-900 font-semibold">₹199/month</strong>.
                </p>

                <div className="pt-1">
                  <PincodeChecker />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <SmartLink
                    href="/customer/items/new"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors duration-200 active:scale-[0.98] shadow-sm hover:shadow-md"
                  >
                    <span>Schedule doorstep pickup</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
                  </SmartLink>

                  <a
                    href="#pricing-calculator"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-5 py-3.5 rounded-xl text-sm font-medium transition-colors duration-200 active:scale-[0.98] shadow-xs hover:border-slate-300"
                  >
                    <span>Estimate storage rate</span>
                  </a>
                </div>

                {/* 4 Concrete Trust Pillars */}
                <div className="pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                  <div className="group">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 group-hover:text-lootup-600 transition-colors">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>₹10,000 cover</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Complimentary insurance</div>
                  </div>

                  <div className="group">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 group-hover:text-lootup-600 transition-colors">
                      <Thermometer className="w-3.5 h-3.5 text-lootup-600" aria-hidden="true" />
                      <span>Climate vault</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">&lt;55% RH humidity guard</div>
                  </div>

                  <div className="group">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 group-hover:text-lootup-600 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5 text-lootup-600" aria-hidden="true" />
                      <span>Doorstep return</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">1-tap retrieval in 24 hrs</div>
                  </div>

                  <div className="group">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 group-hover:text-lootup-600 transition-colors">
                      <FileText className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
                      <span>GST invoices</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">SAC 996729 tax credit</div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Fidelity Interactive Vault Card */}
              <div className="lg:col-span-5 animate-fade-in">
                <VaultInteractivePreview />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            INTERACTIVE SPACE & RENT RECOVERY CALCULATOR
            ========================================================================= */}
        <section className="cv-auto-lg py-20 bg-slate-950 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[34rem] bg-slate-900/60" />}>
              <SpaceRecoveryCalculator />
            </Suspense>
          </div>
        </section>

        {/* =========================================================================
            4-STEP DOORSTEP PROCESS
            ========================================================================= */}
        <section className="cv-auto py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">The Journey</span>
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight mt-1 text-balance">
                How doorstep custody works
              </h2>
              <p className="text-slate-600 text-sm mt-1 text-pretty">
                From packing at your high-rise flat to individual item retrieval whenever you want something back.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md transition-[transform,border-color,box-shadow] duration-300 ease-out group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-xs group-hover:scale-110 group-hover:bg-lootup-50 transition-[transform,background-color] duration-300" aria-hidden="true">
                    <Camera className="w-5 h-5 text-slate-800 group-hover:text-lootup-600 transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">01</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-base">1. Photograph &amp; Estimate</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Snap photos or enter box counts in the web app. The pricing math engine recommends the exact volume tier with transparent monthly pricing.
                </p>
                <div className="text-[11px] font-mono text-lootup-700 bg-lootup-50 px-2.5 py-1 rounded border border-lootup-100 inline-block">
                  Free packing boxes on request
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md transition-[transform,border-color,box-shadow] duration-300 ease-out group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-xs group-hover:scale-110 group-hover:bg-emerald-50 transition-[transform,background-color] duration-300" aria-hidden="true">
                    <Truck className="w-5 h-5 text-slate-800 group-hover:text-emerald-600 transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">02</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-base">2. Doorstep Handover &amp; Barcode</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Choose a 2-hour window. Our background-verified captain arrives with double-wall cartons, seals items with tamper-evident tape, and generates your handover OTP.
                </p>
                <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 inline-block">
                  Serialized 3M security tape
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md transition-[transform,border-color,box-shadow] duration-300 ease-out group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-xs group-hover:scale-110 group-hover:bg-lootup-50 transition-[transform,background-color] duration-300" aria-hidden="true">
                    <Package className="w-5 h-5 text-slate-800 group-hover:text-lootup-600 transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">03</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-base">3. Shelved in Climate Vault</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Items arrive at your city hub (Indiranagar / Bandra / OMR), pass weight and dimensions verification, and are locked into dedicated bin coordinates under 24/7 CCTV.
                </p>
                <div className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 inline-block">
                  Digital inventory on your phone
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md transition-[transform,border-color,box-shadow] duration-300 ease-out group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-xs group-hover:scale-110 group-hover:bg-amber-50 transition-[transform,background-color] duration-300" aria-hidden="true">
                    <RotateCcw className="w-5 h-5 text-slate-800 group-hover:text-amber-600 transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">04</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-base">4. Return Any Single Item</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Need your winter jackets for a Manali trip, or just 1 carton of books? Tap &ldquo;Request Return&rdquo; in the web app. We deliver it to your address within 24 to 48 hours.
                </p>
                <div className="text-[11px] font-mono text-lootup-700 bg-lootup-50 px-2.5 py-1 rounded border border-lootup-100 inline-block">
                  Deliver to any city address
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            COMPARISON TABLE
            ========================================================================= */}
        <section className="cv-auto-lg py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[30rem]" />}>
              <StorageComparison />
            </Suspense>
          </div>
        </section>

        {/* =========================================================================
            FULL INTERACTIVE PRICING CALCULATOR
            ========================================================================= */}
        <section id="pricing-calculator" className="cv-auto-lg py-20 bg-white border-b border-slate-200/80 scroll-mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Transparent Rates</span>
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight mt-1 text-balance">
                Estimate your monthly storage
              </h2>
              <p className="text-slate-600 text-sm mt-1 text-pretty">
                Volume-based billing with full breakdown of pickup, storage, insurance, and 18% GST input credit.
              </p>
            </div>
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[38rem]" />}>
              <PricingCalculator showCta={true} />
            </Suspense>
          </div>
        </section>

        {/* =========================================================================
            CITY HUBS & DAILY COVERAGE GRID
            ========================================================================= */}
        <section className="cv-auto-lg py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[28rem]" />}>
              <CityHubsInteractive />
            </Suspense>
          </div>
        </section>

        {/* =========================================================================
            REAL CUSTOMER CASE STUDIES
            ========================================================================= */}
        <section className="cv-auto py-20 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[24rem] bg-slate-800/60" />}>
              <RealCustomerStories />
            </Suspense>
          </div>
        </section>

        {/* =========================================================================
            SEARCHABLE NATIVE FREQUENTLY ASKED QUESTIONS (<details name="faq">)
            ========================================================================= */}
        <section className="cv-auto py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="mb-10 text-center">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Clarity &amp; Policies</span>
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight mt-1 text-balance">
                Frequently asked questions
              </h2>
              <p className="text-slate-500 text-sm mt-1 text-pretty">
                Everything you need to know about packing, vault custody, insurance, and returns.
              </p>
            </div>

            <div className="divide-y divide-slate-200/80">
              {FAQS.map((faq, idx) => (
                <details
                  key={faq.q}
                  ref={idx === 0 ? firstFaqRef : undefined}
                  name="faq"
                  className="faq-disclosure py-4 group"
                >
                  <summary className="list-none cursor-pointer w-full flex items-center justify-between text-left py-2 gap-4 rounded-lg">
                    <span className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-lootup-600 transition-colors">
                      {faq.q}
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0" aria-hidden="true">
                      <ChevronDown className="w-4 h-4 text-slate-600 faq-chevron transition-transform duration-200" />
                    </span>
                  </summary>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-2 pb-2 text-pretty">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            FINAL HIGH-CONVERTING CTA BANNER
            ========================================================================= */}
        <section className="cv-auto bg-slate-950 text-white py-16 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lootup-500/10 border border-lootup-500/30 text-lootup-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Doorstep Storage in Bengaluru, Mumbai &amp; Chennai</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight text-balance">
              Stop paying expensive rent for unused stuff.<br />
              Reclaim your apartment today.
            </h2>

            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto text-pretty">
              Book a 2-hour collection slot. We provide cartons, seal items with tamper barcodes, and lock them in secure climate vaults.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <SmartLink
                href="/customer/items/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 px-7 py-3.5 rounded-xl text-sm font-semibold transition-colors duration-200 active:scale-[0.98] shadow-sm hover:shadow"
              >
                <span>Schedule pickup</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </SmartLink>

              <a
                href="#pricing-calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 px-6 py-3.5 rounded-xl text-sm font-medium transition-colors duration-200 active:scale-[0.98]"
              >
                <span>Explore pricing calculator</span>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <span>No security deposit</span>
              <span aria-hidden="true">&middot;</span>
              <span>₹10,000 cover included</span>
              <span aria-hidden="true">&middot;</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="bg-slate-950 h-64" aria-hidden="true" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
