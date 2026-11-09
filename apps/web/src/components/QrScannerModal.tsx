'use client';

import React, { useState, useEffect, useId, useRef } from 'react';
import { Camera, X, Scan, CheckCircle2 } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  title?: string;
  sampleCodes?: string[];
}

export function QrScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Scan Item or Bin QR Code',
  sampleCodes = ['LUP-ITM-BLR-00192', 'LUP-ITM-BLR-00284', 'A-01-R1-B1', 'B-02-R3-B4']
}: QrScannerModalProps) {
  const [manualCode, setManualCode] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const manualInputId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      setManualCode('');
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog max-w-md"
      aria-labelledby={headingId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (isOpen) onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      {...({ closedby: 'any' } as any)}
    >
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 mx-auto">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-accent" aria-hidden="true" />
            <h2 id={headingId} className="font-bold text-sm">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner modal"
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative h-64 bg-slate-900 flex items-center justify-center overflow-hidden" aria-hidden="true">
          <div className="w-48 h-48 border-2 border-dashed border-accent/80 rounded-2xl relative flex items-center justify-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-slate-200"></div>
            <Camera className="w-12 h-12 text-slate-600" />
            <span className="absolute bottom-3 text-[10px] text-slate-400 font-mono">Align QR within frame</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs font-bold text-slate-600 mb-1.5">
              Simulate Instant Camera Scan
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleCodes.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    onScanSuccess(code);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-lootup-50 text-lootup-700 text-xs font-mono font-semibold border border-lootup-200 hover:bg-lootup-100 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-lootup-600" aria-hidden="true" />
                  <span>{code}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100">
            <label htmlFor={manualInputId} className="block text-xs font-bold text-slate-600 mb-1.5">
              Or Type Code Manually
            </label>
            <div className="flex gap-2">
              <input
                id={manualInputId}
                type="text"
                placeholder="e.g. LUP-ITM-BLR-00192"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
