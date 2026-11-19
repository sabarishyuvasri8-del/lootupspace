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
    a: '3 months minimum. After that, your plan transitions to month-to-month billing with no lock-in.'
  },
  {
    q: 'Can I retrieve just one single item instead of everything?',
    a: 'Yes. Every box and item has its own barcode and photo in your digital vault. You can recall any single item to your doorstep in 24–48 hours.'
  },
  {
    q: 'What security and climate controls protect stored items?',
    a: 'All facilities feature 24/7 CCTV with 90-day offsite backups, biometric access, and active dehumidification (<55% RH) to protect against monsoon moisture.'
  },
  {
    q: 'Are packing materials provided?',
    a: 'Yes. Our team brings heavy-duty double-wall cartons, bubble wrap, and tamper-evident security tape during pickup.'
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span>Bengaluru · Mumbai · Chennai</span>
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
                  Doorstep storage for things you don&apos;t need every day. We pick up, barcode each box, and hold it in secure climate vaults from <strong className="text-slate-900 font-semibold">₹199/month</strong>.
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
                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                    <span>₹10,000 cover</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span>&lt;55% humidity guard</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span>24–48h return</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span>18% GST invoices</span>
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
            <div className="max-w-xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight text-balance">
                How it works
              </h2>
              <p className="text-slate-500 text-sm mt-1 text-pretty">
                Doorstep pickup to secure vault custody and 24h return.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Step 1 */}
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800" aria-hidden="true">
                    <Camera className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono text-slate-400">01</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Photograph &amp; quote</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Select box sizes or snap photos for an instant volume-based monthly rate.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800" aria-hidden="true">
                    <Truck className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono text-slate-400">02</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Doorstep pickup</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Choose a 2-hour window. Our team brings cartons, seals items with barcodes, and confirms via OTP.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800" aria-hidden="true">
                    <Package className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono text-slate-400">03</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Climate vault</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Stored in dedicated bins under 24/7 CCTV with a digital photo inventory on your phone.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800" aria-hidden="true">
                    <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono text-slate-400">04</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Return on demand</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">
                  Need any box back? Request it from your digital vault for delivery within 24–48 hours.
                </p>
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
            <div className="max-w-xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight text-balance">
                Estimate your monthly storage
              </h2>
              <p className="text-slate-500 text-sm mt-1 text-pretty">
                Pickup, secure climate storage, insurance, and 18% GST input credit included.
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
        <section className="cv-auto py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight text-balance">
                Frequently asked questions
              </h2>
              <p className="text-slate-500 text-sm mt-1 text-pretty">
                Key details on packing, vault custody, and 24h returns.
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight text-balance">
              Reclaim your apartment today.
            </h2>

            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto text-pretty">
              Doorstep collection, climate-controlled vault storage, and 24h returns from ₹199/month.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <SmartLink
                href="/customer/items/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 px-7 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 active:scale-[0.98] shadow-sm hover:shadow"
              >
                <span>Schedule pickup</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </SmartLink>

              <a
                href="#pricing-calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-200 active:scale-[0.98]"
              >
                <span>Calculate rate</span>
              </a>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400 font-mono">
              <span>No deposit</span>
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
