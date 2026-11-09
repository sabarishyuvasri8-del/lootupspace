import React, { useId, useState } from 'react';
import { mockDb } from '@lootupspace/database';
import { SizeTier, StorageItemStatus } from '@lootupspace/shared';
import { QrScannerModal } from '../../components/QrScannerModal';
import {
  Scan,
  Check,
  MapPin
} from 'lucide-react';

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

    setShelveSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-slate-500">Inbound intake</div>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-medium text-slate-950 tracking-tight mt-0.5 text-balance">
            Scan and shelf items
          </h1>
          <p className="text-xs text-slate-500 text-pretty">
            Scan arriving carton barcodes, verify dimensions, inspect condition, and assign rack bins.
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
                    Declared dimensions: {activeItem.length}×{activeItem.width}×{activeItem.height} cm ({activeItem.cubicFeet} cu ft)
                  </div>
                  <div className="text-slate-600 font-mono tabular-nums">
                    Insurance declared value: ₹{activeItem.declaredValueInr}
                  </div>
                </div>
              </div>

              {/* Photos intake list */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-700">Inspection photos ({activeItem.photos.length})</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {activeItem.photos.map((p: any, idx: number) => (
                    <img
                      key={idx}
                      src={p.url}
                      alt={p.caption || `${activeItem.name} inspection photo ${idx + 1}`}
                      width={128}
                      height={128}
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 rounded object-cover border border-slate-200 shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Shelving Form */}
        <form onSubmit={handleConfirmShelving} className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-slate-500" strokeWidth={1.5} aria-hidden="true" />
            <h2 className="font-medium text-slate-900 text-sm">Shelf assignment</h2>
          </div>

          {/* Bin Recommendation Card */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] text-slate-500 block font-mono">
              Suggested location (Zone-Aisle-Rack-Bin)
            </span>
            <div className="font-mono text-xl font-medium text-slate-950">
              {assignedBinCode}
            </div>
            <p className="text-xs text-slate-600 text-pretty">
              Matches climate control requirements for fabric. Capacity remaining: 12.0 cu ft.
            </p>
          </div>

          <div>
            <label htmlFor={tierSelectId} className="block text-xs font-medium text-slate-700 mb-1">Verified size tier</label>
            <select
              id={tierSelectId}
              value={verifiedTier}
              onChange={(e) => setVerifiedTier(e.target.value as SizeTier)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus:outline-2 focus:outline-transparent"
            >
              {Object.values(SizeTier).map((t) => (
                <option key={t} value={t}>
                  {t.toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={binInputId} className="block text-xs font-medium text-slate-700 mb-1">Confirm shelf bin code</label>
            <input
              id={binInputId}
              required
              type="text"
              value={assignedBinCode}
              onChange={(e) => setAssignedBinCode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus:outline-2 focus:outline-transparent"
            />
          </div>

          <div>
            <label htmlFor={notesInputId} className="block text-xs font-medium text-slate-700 mb-1">Condition notes</label>
            <textarea
              id={notesInputId}
              rows={2}
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-900 focus:outline-2 focus:outline-transparent"
            />
          </div>

          {shelveSuccess && (
            <div role="status" className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" strokeWidth={2} aria-hidden="true" />
              <span>Item shelved in Bin {assignedBinCode}. Inventory updated.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Check className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
            <span>Confirm shelving and lock bin</span>
          </button>
        </form>
      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
