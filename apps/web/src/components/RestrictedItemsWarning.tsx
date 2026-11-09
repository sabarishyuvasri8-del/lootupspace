import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { RESTRICTED_PROHIBITED_ITEMS } from '@lootupspace/shared';

export function RestrictedItemsWarning({ onAcknowledge, acknowledged }: { onAcknowledge?: (checked: boolean) => void; acknowledged?: boolean }) {
  return (
    <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 text-slate-800">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0" aria-hidden="true">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-sm">
            Restricted &amp; Prohibited Items Policy
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed text-pretty">
            Under Indian warehousing and fire safety regulations, our pickup drivers cannot accept hazardous, combustible, perishable, or contraband items.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {RESTRICTED_PROHIBITED_ITEMS.slice(0, 4).map((item, idx) => (
          <div key={idx} className="bg-white/90 p-2.5 rounded-xl border border-amber-200">
            <span className="font-bold text-rose-700 block">{item.title}</span>
            <span className="text-[11px] text-slate-600 block mt-0.5">{item.examples}</span>
          </div>
        ))}
      </div>

      {onAcknowledge && (
        <label className="mt-4 flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-amber-300">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => onAcknowledge(e.target.checked)}
            className="w-4 h-4 text-lootup-600 rounded focus:ring-lootup-500"
          />
          <span className="text-xs font-semibold text-slate-900">
            I confirm that none of my stored items contain hazardous, illegal, perishable, or prohibited materials.
          </span>
        </label>
      )}
    </div>
  );
}

