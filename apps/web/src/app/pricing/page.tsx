import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { PricingCalculator } from '../../components/PricingCalculator';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-slate-500">Storage pricing</div>
          <h1 id="main-content" tabIndex={-1} className="text-3xl sm:text-4xl font-medium text-slate-950 tracking-tight text-balance">
            Volume-based storage rates
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed text-pretty">
            Pay strictly for the physical cubic feet your boxes and furniture occupy. Includes complimentary ₹10,000 insurance coverage and 18% GST input credit invoices.
          </p>
        </div>

        <div id="calculator" className="scroll-mt-20">
          <PricingCalculator showCta={true} />
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-medium text-slate-900">Included on all plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-slate-900 flex items-center gap-2 text-xs">
                <Check className="w-4 h-4 text-emerald-600" strokeWidth={1.5} aria-hidden="true" />
                <span>Security and climate</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                <li>24/7 continuous CCTV coverage with rolling archive</li>
                <li>Biometric restricted vault access</li>
                <li>Scheduled pest control and humidity monitoring</li>
                <li>Smoke detectors and fire suppression systems</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-slate-900 flex items-center gap-2 text-xs">
                <Check className="w-4 h-4 text-emerald-600" strokeWidth={1.5} aria-hidden="true" />
                <span>Digital custody inventory</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                <li>Unique QR barcode generated per box or piece</li>
                <li>Intake inspection condition photos saved in app</li>
                <li>Exact rack and bin shelf location tracking</li>
                <li>1-click return retrieval for any single item</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-slate-900 flex items-center gap-2 text-xs">
                <Check className="w-4 h-4 text-emerald-600" strokeWidth={1.5} aria-hidden="true" />
                <span>Doorstep logistics</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                <li>2-hour collection windows</li>
                <li>Live route tracking with driver contact</li>
                <li>4-digit handover confirmation OTP</li>
                <li>Itemized GST tax invoices (SAC 996729)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
