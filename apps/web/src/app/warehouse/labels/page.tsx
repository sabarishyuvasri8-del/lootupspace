import React from 'react';
import { mockDb } from '@lootupspace/database';
import { QrCodeDisplay } from '../../../components/QrCodeDisplay';
import { Printer } from 'lucide-react';

export default function PrintableLabelsPage() {
  const items = mockDb.storageItems;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
        <div>
          <span className="text-xs font-bold text-indigo-600">Label Station</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
            Printable QR Box &amp; Pallet Labels
          </h1>
          <p className="text-xs text-slate-500 text-pretty">
            Adhesive QR stickers for box identification, driver verification, and automated shelf scanning.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors duration-150"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print All Labels (A4 / Thermal)</span>
        </button>
      </div>

      {/* Grid of Printable Labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="printable-labels">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border-2 border-slate-900 space-y-4 shadow-sm page-break-inside-avoid"
          >
            {/* Label Header */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs" aria-hidden="true">
                  L
                </div>
                <span className="font-semibold text-sm tracking-tight text-slate-900">
                  Lootup<span className="text-accent">space</span>
                </span>
              </div>
              <span className="font-mono text-xs font-semibold bg-slate-900 text-white px-2 py-0.5 rounded">
                {item.binCode || 'BIN-PENDING'}
              </span>
            </div>

            {/* QR Center */}
            <div className="flex items-center justify-center py-2">
              <QrCodeDisplay value={item.qrCode} label={item.qrCode} size={160} />
            </div>

            {/* Item Details */}
            <div className="space-y-1 text-xs border-t-2 border-slate-900 pt-3">
              <h2 className="font-semibold text-slate-900 text-sm truncate">{item.name}</h2>
              <div className="text-slate-600 flex justify-between">
                <span>Tier: <strong>{item.sizeTier.replace('_', ' ')}</strong></span>
                <span>Volume: <strong className="tabular-nums">{item.cubicFeet} cu ft</strong></span>
              </div>
              <div className="text-[10px] text-slate-500 truncate pt-1">
                Owner: {mockDb.users[0]?.name} • Verified at Hub
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

