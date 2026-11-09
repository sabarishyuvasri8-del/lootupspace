import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SmartLink } from '../../components/SmartLink';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-500">Service workflow</div>
          <h1 id="main-content" tabIndex={-1} className="text-3xl sm:text-4xl font-medium text-slate-950 tracking-tight text-balance">
            How doorstep storage works
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed text-pretty">
            Eliminating trucks, self-storage padlocks, and warehouse commutes. Everything is photographed at your door, cataloged digitally, and returned on demand.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 font-mono text-xs font-medium" aria-hidden="true">
              01
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              <h2 className="text-sm font-medium text-slate-900">Photograph and record items</h2>
              <p className="text-slate-600 leading-relaxed text-xs text-pretty">
                Take 2 to 8 photos of each item or box using your phone camera. Enter approximate dimensions or choose standard size tiers (Small Box, Medium Box, Large Box, or Furniture). Our engine computes the exact monthly rate on the fly.
              </p>
              <div className="text-[11px] text-slate-500 font-mono pt-1">
                Multiple items can be compiled into a single pickup booking.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 font-mono text-xs font-medium" aria-hidden="true">
              02
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              <h2 className="text-sm font-medium text-slate-900">Schedule doorstep collection</h2>
              <p className="text-slate-600 leading-relaxed text-xs text-pretty">
                Select your preferred date and 2-hour morning or evening slot. Choose professional packing or supplies if needed. Complete payment with an itemized 18% GST tax invoice.
              </p>
            </div>
          </div>

          <div id="relocation" className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start scroll-mt-20">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 font-mono text-xs font-medium" aria-hidden="true">
              03
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              <h2 className="text-sm font-medium text-slate-900">Driver verification and secure shelving</h2>
              <p className="text-slate-600 leading-relaxed text-xs text-pretty">
                Our background-verified courier arrives, verifies piece count, and collects items with a 4-digit handover OTP. At our metro hub, items undergo intake inspection, receive a barcode tag, and are shelved into an exact rack and bin.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 font-mono text-xs font-medium" aria-hidden="true">
              04
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              <h2 className="text-sm font-medium text-slate-900">1-click retrieval to your door</h2>
              <p className="text-slate-600 leading-relaxed text-xs text-pretty">
                Open your digital inventory, select individual pieces or your entire storage lot, and tap &ldquo;Request Return&rdquo;. We pick the items from warehouse bins and deliver them back to your door with signature confirmation.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <SmartLink
            href="/customer/items/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors duration-150"
          >
            <span>Schedule a pickup</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          </SmartLink>
          <SmartLink
            href="/pricing"
            className="text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            View pricing calculator &rarr;
          </SmartLink>
        </div>
      </main>

      <Footer />
    </div>
  );
}
