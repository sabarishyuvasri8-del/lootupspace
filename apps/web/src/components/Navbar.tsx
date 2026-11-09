'use client';

import React, { useState, useId } from 'react';
import { Package, Menu, X, ArrowRight } from 'lucide-react';
import { SmartLink } from './SmartLink';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerId = useId();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <SmartLink href="/" className="flex items-center gap-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white" aria-hidden="true">
            <Package className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Lootupspace
          </span>
        </SmartLink>

        {/* Desktop Links */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6 text-sm text-slate-600">
          <SmartLink href="/how-it-works" className="hover:text-slate-900 transition-colors duration-150">How it works</SmartLink>
          <SmartLink href="/pricing" className="hover:text-slate-900 transition-colors duration-150">Pricing calculator</SmartLink>
          <SmartLink href="/what-you-can-store" className="hover:text-slate-900 transition-colors duration-150">What to store</SmartLink>
          <SmartLink href="/cities" className="hover:text-slate-900 transition-colors duration-150">Cities</SmartLink>
          <SmartLink href="/safety" className="hover:text-slate-900 transition-colors duration-150">Safety and insurance</SmartLink>
          <SmartLink href="/for-business" className="hover:text-slate-900 transition-colors duration-150">For business</SmartLink>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <SmartLink
            href="/customer"
            className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            My storage
          </SmartLink>
          <SmartLink
            href="/customer/items/new"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 active:scale-[0.98]"
          >
            <span>Schedule pickup</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          </SmartLink>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls={drawerId}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" /> : <Menu className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          id={drawerId}
          aria-label="Mobile"
          className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3"
        >
          <SmartLink href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm text-slate-700">How it works</SmartLink>
          <SmartLink href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm text-slate-700">Pricing calculator</SmartLink>
          <SmartLink href="/what-you-can-store" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm text-slate-700">What you can store</SmartLink>
          <SmartLink href="/cities" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm text-slate-700">Cities and serviceability</SmartLink>
          <SmartLink href="/safety" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm text-slate-700">Safety and insurance</SmartLink>
          <SmartLink href="/for-business" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm text-slate-700">For business</SmartLink>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <SmartLink
              href="/customer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-800"
            >
              My storage
            </SmartLink>
            <SmartLink
              href="/customer/items/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg bg-slate-900 text-white text-xs font-medium"
            >
              Schedule pickup
            </SmartLink>
          </div>
        </nav>
      )}
    </header>
  );
}
