import React, { useState, useId } from 'react';
import { SERVICEABLE_CITIES } from '@lootupspace/shared';
import { CheckCircle2, AlertCircle, ArrowRight, MapPin } from 'lucide-react';
import { SmartLink } from './SmartLink';

const SERVICEABLE_PINCODES = new Set(
  SERVICEABLE_CITIES.flatMap((c) => c.pincodes)
);

const POPULAR_PINCODES = [
  { pin: '560038', area: 'Indiranagar', city: 'BLR' },
  { pin: '560102', area: 'HSR Layout', city: 'BLR' },
  { pin: '400050', area: 'Bandra West', city: 'MUM' },
  { pin: '400076', area: 'Powai', city: 'MUM' },
  { pin: '600020', area: 'Adyar', city: 'MAA' },
  { pin: '600096', area: 'OMR Perungudi', city: 'MAA' }
];

export function PincodeChecker({ autoFocus = false }: { autoFocus?: boolean }) {
  const inputId = useId();
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    serviceable: boolean;
    areaName?: string;
    message?: string;
  }>({
    checked: false,
    serviceable: false
  });

  const checkPinValue = (pin: string) => {
    const cleanPin = pin.trim();
    if (cleanPin.length !== 6) return;

    const isServiceable = SERVICEABLE_PINCODES.has(cleanPin);
    const popularMatch = POPULAR_PINCODES.find((p) => p.pin === cleanPin);

    setPincodeStatus({
      checked: true,
      serviceable: isServiceable,
      areaName: popularMatch ? `${popularMatch.area}, ${popularMatch.city}` : undefined,
      message: isServiceable
        ? `Doorstep collection & return active for ${cleanPin}. Next 2-hr pickup window available today.`
        : `Pincode ${cleanPin} is not yet on our daily route. We are expanding to this postal zone soon!`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkPinValue(pincodeQuery);
  };

  const handleSelectQuickPill = (pin: string) => {
    setPincodeQuery(pin);
    checkPinValue(pin);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
        <div className="relative flex-1">
          <label htmlFor={inputId} className="visually-hidden">
            Enter 6-digit service pincode
          </label>
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="Enter 6-digit pincode (e.g. 560038)"
            value={pincodeQuery}
            autoFocus={autoFocus}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setPincodeQuery(val);
              if (val.length === 6) checkPinValue(val);
              else if (pincodeStatus.checked) setPincodeStatus({ checked: false, serviceable: false });
            }}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:border-slate-500 font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-1.5 shrink-0 active:scale-[0.98]"
        >
          <span>Check route</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </form>

      {/* Quick click metro postal pills */}
      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-500 font-mono">Popular zones:</span>
        {POPULAR_PINCODES.map((item) => (
          <button
            key={item.pin}
            type="button"
            aria-pressed={pincodeQuery === item.pin}
            onClick={() => handleSelectQuickPill(item.pin)}
            className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
              pincodeQuery === item.pin
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {item.pin} ({item.city})
          </button>
        ))}
      </div>

      {/* Live region feedback banner */}
      <div aria-live="polite" aria-atomic="true">
        {pincodeStatus.checked && (
          <div
            className={`mt-3 p-3 rounded-lg text-xs border flex items-start gap-2.5 transition-colors ${
              pincodeStatus.serviceable
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {pincodeStatus.serviceable ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="flex-1">
              <div className="font-medium">
                {pincodeStatus.serviceable ? 'Doorstep Service Active' : 'Outside Current Active Route'}
              </div>
              <p className="mt-0.5 text-[11px] text-slate-600 leading-relaxed">{pincodeStatus.message}</p>
              {pincodeStatus.serviceable && (
                <div className="mt-2 flex items-center gap-2">
                  <SmartLink
                    href="/customer/items/new"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    <span>Book doorstep collection for this pincode &rarr;</span>
                  </SmartLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
