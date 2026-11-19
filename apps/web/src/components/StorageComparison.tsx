import React, { useId } from 'react';
import { Check, X, Package } from 'lucide-react';
import { SmartLink } from './SmartLink';

export function StorageComparison() {
  const headingId = useId();

  const comparisons = [
    {
      feature: 'Doorstep pickup',
      lootup: 'Included 2-hour doorstep collection',
      traditional: 'Self-arranged tempo and traffic'
    },
    {
      feature: 'Heavy lifting & boxes',
      lootup: 'Cartons, bubble wrap, and lifting included',
      traditional: 'Pack, lift, and haul boxes yourself'
    },
    {
      feature: 'Digital vault inventory',
      lootup: 'Itemized photos and barcodes on your phone',
      traditional: 'No inventory; easy to lose track'
    },
    {
      feature: 'Single-item return',
      lootup: '1-tap return for any individual carton in 24–48h',
      traditional: 'Drive to distant industrial godowns'
    },
    {
      feature: 'Climate & security',
      lootup: '<55% humidity control and 24/7 CCTV',
      traditional: 'Tin sheds with monsoon moisture risk'
    },
    {
      feature: 'Insurance cover',
      lootup: '₹10,000 complimentary cover per carton',
      traditional: 'Stored at owner&apos;s risk'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-100">
        <h2 id={headingId} className="text-2xl font-medium text-slate-900 tracking-tight text-balance">
          Lootupspace vs traditional self-storage
        </h2>
        <p className="text-slate-500 text-sm mt-1 text-pretty">
          Doorstep custody built for Indian metro apartments.
        </p>
      </div>

      <div tabIndex={0} role="region" aria-labelledby={headingId} className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <caption className="visually-hidden">
            Comparison of Lootupspace doorstep custody versus traditional godown self-storage
          </caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th scope="col" className="py-4 px-6 font-medium text-slate-700 w-1/3">Feature</th>
              <th scope="col" className="py-4 px-6 font-medium text-slate-900 bg-lootup-50/50 border-x border-lootup-100 w-1/3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]" aria-hidden="true">
                    <Package className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-slate-950">Lootupspace</span>
                </div>
              </th>
              <th scope="col" className="py-4 px-6 font-medium text-slate-600 w-1/3">Traditional Godown / Self-Storage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisons.map((row) => (
              <tr key={row.feature} className="hover:bg-slate-50/60 transition-colors">
                <th scope="row" className="py-4 px-6 font-medium text-slate-900 align-top">
                  {row.feature}
                </th>
                <td className="py-4 px-6 bg-lootup-50/30 border-x border-lootup-100/70">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-slate-800 font-medium leading-relaxed">{row.lootup}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-slate-600 leading-relaxed">{row.traditional}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <span className="font-mono">Serving Bengaluru (Indiranagar, Koramangala, HSR) · Mumbai · Chennai</span>
        <SmartLink
          href="/customer/items/new"
          className="inline-flex items-center gap-1.5 font-medium text-slate-900 hover:text-lootup-600 transition-colors"
        >
          <span>Schedule your first pickup &rarr;</span>
        </SmartLink>
      </div>
    </div>
  );
}
