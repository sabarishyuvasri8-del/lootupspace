'use client';

import React, { useEffect, useState } from 'react';

export function QrCodeDisplay({ value, size = 180, label }: { value: string; size?: number; label?: string }) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    if (value) {
      import('qrcode')
        .then(({ default: QRCode }) =>
          QRCode.toDataURL(value, {
            margin: 1,
            width: size,
            color: {
              dark: '#0F172A',
              light: '#FFFFFF'
            }
          })
        )
        .then((url) => {
          if (!cancelled) setDataUrl(url);
        })
        .catch(console.error);
    }
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className="bg-slate-100 animate-pulse rounded-xl"
        style={{ width: size, height: size }}
        aria-label="Generating QR code"
      />
    );
  }

  return (
    <div className="inline-flex flex-col items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
      <img
        src={dataUrl}
        alt={`QR Code for ${value}`}
        className="rounded-lg"
        width={size}
        height={size}
        decoding="async"
      />
      {label && <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">{label}</span>}
      <span className="text-[9px] text-slate-500 font-mono tracking-wider">{value}</span>
    </div>
  );
}
