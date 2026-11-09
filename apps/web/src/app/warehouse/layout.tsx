import React from 'react';
import { Warehouse, Scan, Map, PackageOpen, Printer } from 'lucide-react';
import { usePathname, Outlet } from '../../lib/navigation';
import { SmartLink } from '../../components/SmartLink';

export default function WarehouseLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { label: 'Inbound intake', href: '/warehouse', icon: Scan },
    { label: 'Bin inventory map', href: '/warehouse/inventory', icon: Map },
    { label: 'Outbound pick list', href: '/warehouse/outbound', icon: PackageOpen },
    { label: 'Box labels', href: '/warehouse/labels', icon: Printer }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200" aria-hidden="true">
            <Warehouse className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs text-white">Warehouse terminal</span>
              <span className="text-[10px] font-mono text-slate-400">WH-BLR-01 Indiranagar</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Priya Sundaram · CCTV active</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav aria-label="Warehouse" className="flex items-center gap-1 overflow-x-auto text-xs">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <SmartLink
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                <span>{link.label}</span>
              </SmartLink>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">{children || <Outlet />}</main>
    </div>
  );
}
