import React from 'react';
import { Truck, Shield, User } from 'lucide-react';
import { Outlet, usePathname } from '../../lib/navigation';
import { SmartLink } from '../../components/SmartLink';

export default function DriverLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-md mx-auto border-x border-slate-800">
      {/* Top Bar */}
      <header className="bg-slate-950 px-4 py-3 border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200" aria-hidden="true">
            <Truck className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-medium text-xs text-slate-200 flex items-center gap-2">
              <span>Driver route terminal</span>
              <span className="text-[10px] font-mono text-emerald-400"><span aria-hidden="true">● </span>On duty</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">KA-01-EJ-4912 · Tata Ace</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-300 tabular-nums">142 trips</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">{children || <Outlet />}</main>

      {/* Driver Bottom Bar */}
      <footer className="bg-slate-950 border-t border-slate-800 fixed bottom-0 left-0 right-0 max-w-md mx-auto p-2.5">
        <nav aria-label="Driver quick" className="flex justify-around text-xs">
          <SmartLink
            href="/driver"
            aria-current={pathname === '/driver' ? 'page' : undefined}
            className="flex flex-col items-center text-slate-200 font-medium"
          >
            <Truck className="w-4 h-4 mb-0.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-[10px]">Stops</span>
          </SmartLink>
          <SmartLink href="/driver?tab=earnings" className="flex flex-col items-center text-slate-400 hover:text-slate-200">
            <Shield className="w-4 h-4 mb-0.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-[10px]">Earnings</span>
          </SmartLink>
          <SmartLink href="/customer" className="flex flex-col items-center text-slate-400 hover:text-slate-200">
            <User className="w-4 h-4 mb-0.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-[10px]">Customer app</span>
          </SmartLink>
        </nav>
      </footer>
    </div>
  );
}
