import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { RESTRICTED_PROHIBITED_ITEMS } from '@lootupspace/shared';
import { Check, X } from 'lucide-react';

export default function WhatYouCanStorePage() {
  const allowedCategories = [
    { title: 'Seasonal Clothes & Quilts', desc: 'Winter wear, wedding attire, quilts, jackets, blankets vacuum-packed.' },
    { title: 'Books & Academic Notes', desc: 'Novels, legal volumes, engineering files, personal libraries.' },
    { title: 'Furniture & Study Desks', desc: 'Chairs, study tables, disassembled beds, coffee tables, armchairs.' },
    { title: 'Appliances & Consumer Tech', desc: 'Monitors, air fryers, vacuum cleaners, mic stands, speakers.' },
    { title: 'Sports & Fitness Equipment', desc: 'Bicycles, cricket kits, golf bags, dumbbells, yoga accessories.' },
    { title: 'Luggage & Travel Bags', desc: 'Hard-shell trolleys, duffle bags, trekking rucksacks, camping tents.' },
    { title: 'Kitchenware & Crockery', desc: 'Dinner sets, pressure cookers, festive brass vessels, glassware.' },
    { title: 'B2B Business Archives', desc: 'Tax audit binders, company records, trade show banners, event props.' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-lootup-600">Item Guidelines</span>
          <h1 id="main-content" tabIndex={-1} className="text-3xl sm:text-5xl font-semibold text-slate-900 tracking-tight text-balance">
            What You Can &amp; Cannot Store
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto text-pretty">
            We store almost everything that clutters a city flat, while maintaining strict compliance with fire safety, hygiene, and Indian warehousing laws.
          </p>
        </div>

        {/* Accepted Items Grid */}
        <div id="student" className="space-y-6 scroll-mt-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center" aria-hidden="true">
              <Check className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Items We Gladly Store &amp; Protect</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allowedCategories.map((cat) => (
              <div key={cat.title} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center" aria-hidden="true">
                  <Check className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{cat.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prohibited Items Section */}
        <div className="space-y-6 bg-rose-50/60 p-8 rounded-2xl border-2 border-rose-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center" aria-hidden="true">
              <X className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-rose-950">Restricted &amp; Prohibited Goods</h2>
              <p className="text-xs text-rose-800">Our pickup teams are strictly prohibited from collecting these items.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {RESTRICTED_PROHIBITED_ITEMS.map((item, idx) => (
              <div key={item.title} className="bg-white p-5 rounded-2xl border border-rose-200 space-y-2 shadow-sm">
                <span className="text-xs font-semibold text-rose-700 block">
                  Prohibited #{idx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed text-pretty">{item.reason}</p>
                <div className="text-[11px] font-medium text-rose-800 bg-rose-50 p-2 rounded-lg">
                  Examples: {item.examples}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
