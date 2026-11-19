import React, { useId, useState } from 'react';
import { mockDb } from '@lootupspace/database';
import { SizeTier, StorageItemStatus } from '@lootupspace/shared';
import { QrScannerModal } from '../../../components/QrScannerModal';
import {
  Scan,
  Check,
  MapPin,
  PackageCheck,
  ArrowRight
} from 'lucide-react';
import { SmartLink } from '../../../components/SmartLink';

export default function WarehouseIntakePage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('LUP-ITM-BLR-00192');
  const [activeItem, setActiveItem] = useState<any>(mockDb.storageItems[0] || null);

  const [verifiedTier, setVerifiedTier] = useState<SizeTier>(SizeTier.MEDIUM_BOX);
  const [assignedBinCode, setAssignedBinCode] = useState('B-02-R3-B4');
  const [inspectionNotes, setInspectionNotes] = useState('Condition verified: sealed in 5-ply cartons, no dampness.');
  const [shelveSuccess, setShelveSuccess] = useState(false);
  const formId = useId();
  const tierSelectId = `${formId}-tier`;
  const binInputId = `${formId}-bin`;
  const notesInputId = `${formId}-notes`;

  const handleScanSuccess = (code: string) => {
    setScannedCode(code);
    const item = mockDb.storageItems.find((i) => i.qrCode === code || i.id === code) || mockDb.storageItems[0];
    setActiveItem(item);
    setVerifiedTier(item.sizeTier);
    setAssignedBinCode(item.binCode || 'B-02-R3-B4');
    setShelveSuccess(false);
  };

  const handleConfirmShelving = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    activeItem.sizeTier = verifiedTier;
    activeItem.binCode = assignedBinCode;
    activeItem.status = StorageItemStatus.STORED;
    activeItem.storedAt = new Date().toISOString();
    activeItem.notes = `${activeItem.notes || ''} [Warehouse intake verified]`;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lootup_db_updated'));
    }

    setShelveSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-slate-500">Inbound intake terminal</div>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-medium text-slate-950 tracking-tight mt-0.5 text-balance">
            Scan and shelf arriving items
          </h1>
          <p className="text-xs text-slate-500 text-pretty">
            Scan arriving carton barcodes from delivery drivers, verify dimensions, inspect condition, and assign rack bins.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors duration-150 active:scale-[0.98]"
        >
          <Scan className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          <span>Scan barcode</span>
        </button>
      </div>

      {/* Main Intake Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Scanned Item Details */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-mono text-slate-500">Scanned item</span>
              <div className="font-mono text-xs font-medium text-slate-900 mt-0.5">{scannedCode}</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Arrival verified
            </span>
          </div>

          {activeItem && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={activeItem.photos[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80'}
                  alt={activeItem.name}
                  width={320}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className="w-full sm:w-40 h-32 rounded-lg object-cover bg-slate-100 shrink-0"
                />
                <div className="space-y-1 flex-1 text-xs">
                  <h2 className="font-medium text-slate-900 text-sm">{activeItem.name}</h2>
                  <p className="text-slate-500 leading-relaxed text-pretty">{activeItem.description}</p>
                  <div className="text-slate-600 pt-1 font-mono tabular-nums">
                    Declared value: ₹{activeItem.declaredValueInr?.toLocaleString('en-IN') || '45,000'}
                  </div>
                  <div className="text-slate-600 font-mono tabular-nums">
                    Declared dimensions: {activeItem.length} x {activeItem.width} x {activeItem.height} cm ({activeItem.cubicFeet?.toFixed(1) || '1.8'} cu ft)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                <div className="text-[11px] font-mono text-slate-500">Customer notes</div>
                <p className="text-slate-700 italic text-pretty">"{activeItem.notes || 'Please handle with care. Contains fragile glassware.'}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Shelving & Verification Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[11px] font-mono text-slate-500">Intake verification</span>
            <div className="text-sm font-medium text-slate-900 mt-0.5">Audit &amp; assign bin coordinate</div>
          </div>

          {shelveSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3" role="status" aria-live="polite">
              <div className="flex items-center gap-2 text-emerald-900 font-medium text-xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Item successfully shelved into vault!</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-mono">
                Assigned Bin: <strong>{assignedBinCode}</strong> · Status: STORED
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShelveSuccess(false)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors"
                >
                  Intake next item
                </button>
                <SmartLink
                  href="/warehouse"
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-medium hover:bg-emerald-50 transition-colors"
                >
                  Back to Dispatch Desk
                </SmartLink>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmShelving} className="space-y-4 text-xs">
              <div>
                <label htmlFor={tierSelectId} className="block text-slate-700 font-medium mb-1">
                  Verified Size Tier
                </label>
                <select
                  id={tierSelectId}
                  value={verifiedTier}
                  onChange={(e) => setVerifiedTier(e.target.value as SizeTier)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value={SizeTier.SMALL_BOX}>Small Box (&lt; 1.5 cu ft)</option>
                  <option value={SizeTier.MEDIUM_BOX}>Medium Box (1.5 - 3.5 cu ft)</option>
                  <option value={SizeTier.LARGE_BOX}>Large Box (3.5 - 8.0 cu ft)</option>
                  <option value={SizeTier.EXTRA_LARGE_FURNITURE}>Bulky / Furniture (&gt; 8 cu ft)</option>
                </select>
              </div>

              <div>
                <label htmlFor={binInputId} className="block text-slate-700 font-medium mb-1">
                  Assigned Rack / Bin Coordinate
                </label>
                <div className="relative">
                  <input
                    id={binInputId}
                    type="text"
                    value={assignedBinCode}
                    onChange={(e) => setAssignedBinCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. B-02-R3-B4"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400">
                    Zone B (Climate)
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor={notesInputId} className="block text-slate-700 font-medium mb-1">
                  Physical Condition Inspection
                </label>
                <textarea
                  id={notesInputId}
                  rows={2}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  placeholder="Record packaging condition, barcoding seal, etc."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors duration-150 active:scale-[0.98]"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Confirm shelving &amp; notify customer</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <QrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
