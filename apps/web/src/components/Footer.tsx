import React from 'react';
import { Package, Shield, Lock, MapPin, Globe, Twitter, Instagram, Linkedin, Youtube, MessageCircle, ArrowUp } from 'lucide-react';
import { SmartLink } from './SmartLink';

export function Footer() {
  const scrollToTop = () => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <footer id="footer" className="relative bg-slate-950 text-slate-400 pt-16 pb-6 border-t border-slate-900 overflow-hidden">
      {/* Subtle ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-lootup-500/5 blur-[120px] rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-12 border-b border-slate-900/80">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-lootup-500/10 border border-lootup-500/30 flex items-center justify-center text-lootup-400 shadow-sm shadow-lootup-500/20" aria-hidden="true">
                <Package className="w-4 h-4" strokeWidth={2} />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Lootupspace
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-lootup-400">
                v2.0
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Your space, back. Your stuff, safe. On-demand doorstep storage with digital vault inventory, climate monitoring, and scheduled returns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Region / Language indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>India · English</span>
            </div>

            {/* Quick Action Pill Button */}
            <SmartLink
              href="/customer/items/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-tight transition-colors duration-150 active:scale-95 shadow-sm"
            >
              <span>Schedule pickup</span>
              <span aria-hidden="true">&rarr;</span>
            </SmartLink>
          </div>
        </div>

        {/* Link Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 text-xs border-b border-slate-900/80">
          {/* Column 1: Service */}
          <div className="space-y-3">
            <h2 className="font-semibold tracking-wide text-xs uppercase text-slate-200">
              Service
            </h2>
            <ul className="space-y-2.5">
              <li><SmartLink href="/how-it-works" className="hover:text-white transition-colors duration-150">How it works</SmartLink></li>
              <li><SmartLink href="/pricing" className="hover:text-white transition-colors duration-150">Pricing calculator</SmartLink></li>
              <li><SmartLink href="/what-you-can-store" className="hover:text-white transition-colors duration-150">What to store</SmartLink></li>
              <li><SmartLink href="/safety" className="hover:text-white transition-colors duration-150">Safety and insurance</SmartLink></li>
              <li><SmartLink href="/for-business" className="hover:text-white transition-colors duration-150">For business &amp; startups</SmartLink></li>
              <li><SmartLink href="/cities" className="hover:text-white transition-colors duration-150">Serviceable pincodes</SmartLink></li>
            </ul>
          </div>

          {/* Column 2: Storage Solutions */}
          <div className="space-y-3">
            <h2 className="font-semibold tracking-wide text-xs uppercase text-slate-200">
              Solutions
            </h2>
            <ul className="space-y-2.5">
              <li><SmartLink href="/pricing#calculator" className="hover:text-white transition-colors duration-150">Apartment declutter</SmartLink></li>
              <li><SmartLink href="/how-it-works#relocation" className="hover:text-white transition-colors duration-150">Relocation holding</SmartLink></li>
              <li><SmartLink href="/what-you-can-store#student" className="hover:text-white transition-colors duration-150">Student vacation storage</SmartLink></li>
              <li><SmartLink href="/for-business#inventory" className="hover:text-white transition-colors duration-150">E-commerce buffer stock</SmartLink></li>
              <li><SmartLink href="/safety#climate" className="hover:text-white transition-colors duration-150">Climate-controlled items</SmartLink></li>
              <li><SmartLink href="/customer/inventory" className="hover:text-white transition-colors duration-150">Digital Vault browser</SmartLink></li>
            </ul>
          </div>

          {/* Column 3: Cities Served */}
          <div className="space-y-3">
            <h2 className="font-semibold tracking-wide text-xs uppercase text-slate-200">
              Cities served
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3 h-3 text-lootup-400 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Bengaluru (Central &amp; Outer)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3 h-3 text-lootup-400 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Mumbai (BKC, Andheri, Powai)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3 h-3 text-lootup-400 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Chennai (OMR &amp; Anna Nagar)</span>
              </li>
              <li className="text-[11px] text-slate-400 pt-1 font-mono">
                Expanding to Hyderabad &amp; Pune
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div className="space-y-3">
            <h2 className="font-semibold tracking-wide text-xs uppercase text-slate-200">
              Legal &amp; Trust
            </h2>
            <ul className="space-y-2.5">
              <li><SmartLink href="/terms" className="hover:text-white transition-colors duration-150">Terms of service</SmartLink></li>
              <li><SmartLink href="/privacy" className="hover:text-white transition-colors duration-150">Privacy policy (DPDP Act)</SmartLink></li>
              <li><SmartLink href="/storage-agreement" className="hover:text-white transition-colors duration-150">Storage agreement</SmartLink></li>
              <li><SmartLink href="/refund-policy" className="hover:text-white transition-colors duration-150">Refund &amp; early exit policy</SmartLink></li>
              <li><SmartLink href="/customer/support" className="hover:text-white transition-colors duration-150">Support and grievance</SmartLink></li>
            </ul>
          </div>

          {/* Column 5: Social & Security Credentials */}
          <div className="space-y-4">
            <h2 className="font-semibold tracking-wide text-xs uppercase text-slate-200">
              Connect &amp; Security
            </h2>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Lootupspace on Twitter" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors">
                <Twitter className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Lootupspace on Instagram" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors">
                <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="Lootupspace on LinkedIn" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors">
                <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Lootupspace on YouTube" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors">
                <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a href="https://wa.me" target="_blank" rel="noreferrer" aria-label="WhatsApp Concierge" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-emerald-400 hover:border-slate-700 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="space-y-1.5 pt-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Complimentary ₹10k insurance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-lootup-400 shrink-0" aria-hidden="true" />
                <span>24/7 CCTV &amp; biometric vault</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimers & Copyright Row */}
        <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>&copy; {new Date().getFullYear()} Lootupspace Technologies Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span>GST registered (18% SAC 996729)</span>
            <span aria-hidden="true">&middot;</span>
            <span>Razorpay verified merchant</span>
            <span aria-hidden="true">&middot;</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors ml-2 px-1.5 py-0.5 rounded"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* DISCORD-STYLE COLOSSAL "LOOTUPSPACE" BOLD WORDMARK */}
      <div className="w-full overflow-hidden select-none pointer-events-none pt-6 sm:pt-8 pb-3 flex items-center justify-center" aria-hidden="true">
        <div className="w-full max-w-[96vw] flex items-center justify-center px-4 sm:px-6">
          <span
            className="font-black tracking-[-0.055em] leading-none text-slate-100/90 whitespace-nowrap text-center text-[clamp(2.5rem,13vw,14.5rem)]"
          >
            Lootupspace
          </span>
        </div>
      </div>

      {/* Floating corner brand badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end pb-2 pt-1">
        <SmartLink
          href="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors duration-150 shadow-sm"
        >
          <Package className="w-3 h-3 text-lootup-400" aria-hidden="true" />
          <span>Lootupspace</span>
          <span className="visually-hidden"> home</span>
        </SmartLink>
      </div>
    </footer>
  );
}
