import React, { useState, useEffect } from 'react';
import { Warehouse, Scan, Map, PackageOpen, Printer, ClipboardCheck, Activity, Thermometer } from 'lucide-react';
import { usePathname, Outlet } from '../../lib/navigation';
import { SmartLink } from '../../components/SmartLink';
import { mockDb } from '@lootupspace/database';
import { PickupStatus, ReturnStatus } from '@lootupspace/shared';

export default function WarehouseLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  const [pendingCount, setPendingCount] = useState(() => {
    const pendingPickups = mockDb.pickupRequests.filter((p) => !p.driverId || p.status === PickupStatus.BOOKED).length;
    const pendingReturns = mockDb.returnRequests.filter((r) => !r.driverId || r.status === ReturnStatus.REQUESTED).length;
    return pendingPickups + pendingReturns;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const p = mockDb.pickupRequests.filter((pk) => !pk.driverId || pk.status === PickupStatus.BOOKED).length;
      const r = mockDb.returnRequests.filter((rt) => !rt.driverId || rt.status === ReturnStatus.REQUESTED).length;
      setPendingCount(p + r);
    };
    window.addEventListener('lootup_db_updated', handleUpdate);
    return () => window.removeEventListener('lootup_db_updated', handleUpdate);
  }, []);

  const links = [
    { label: 'Customer Requests & Dispatch', href: '/warehouse', icon: ClipboardCheck, badge: pendingCount },
    { label: 'Inbound Intake & Scan', href: '/warehouse/intake', icon: Scan },
    { label: 'Outbound Pick & Pack', href: '/warehouse/outbound', icon: PackageOpen },
    { label: 'Bin Inventory Map', href: '/warehouse/inventory', icon: Map },
    { label: 'Box QR Labels', href: '/warehouse/labels', icon: Printer }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar */}
      <header className="bg-slate-950 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shadow-inner" aria-hidden="true">
            <Warehouse className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs tracking-tight text-white">Warehouse Operations Suite</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                WH-BLR-01 Indiranagar
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
              <span>Shift Lead: Priya Sundaram</span>
              <span>·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Vault Online (22°C · 48% RH)
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry pill */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Capacity: 36.5% (18,240 / 50k cu ft)</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-amber-400">
            <span>Pending Dispatch: {pendingCount}</span>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav aria-label="Warehouse Operations" className="flex items-center gap-1 overflow-x-auto text-xs w-full lg:w-auto pt-2 lg:pt-0">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <SmartLink
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                <span>{link.label}</span>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 ml-0.5">
                    {link.badge}
                  </span>
                )}
              </SmartLink>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">{children || <Outlet />}</main>
    </div>
  );
}
