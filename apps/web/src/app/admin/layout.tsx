'use client';

import React from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  ShieldCheck,
  LayoutDashboard,
  Truck,
  Users,
  Warehouse,
  DollarSign,
  Receipt,
  History,
  LogOut
} from 'lucide-react';
import { usePathname, Outlet } from '../../lib/navigation';
import { SmartLink } from '../../components/SmartLink';

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { label: 'Executive dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders and dispatches', href: '/admin/orders', icon: Truck },
    { label: 'Customer directory', href: '/admin/customers', icon: Users },
    { label: 'Drivers and fleet', href: '/admin/drivers', icon: Truck },
    { label: 'Warehouses and bins', href: '/admin/warehouses', icon: Warehouse },
    { label: 'Pricing rules', href: '/admin/pricing', icon: DollarSign },
    { label: 'Payments and tax', href: '/admin/payments', icon: Receipt },
    { label: 'Audit logs', href: '/admin/audit-logs', icon: History }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200" aria-hidden="true">
            <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs text-white">Lootupspace console</span>
              <span className="text-[10px] font-mono text-slate-400">Operations & finance</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Siddharth Iyer (VP Ops) · All metro hubs active</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={logout}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors duration-150 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span>Exit console</span>
          </button>
        </div>
      </header>

      {/* Admin Shell */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-3 space-y-3">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 sticky top-20">
              <div className="text-[11px] font-mono text-slate-500 px-2 py-1">
                Navigation
              </div>
              <nav aria-label="Admin" className="space-y-0.5 mt-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <SmartLink
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors duration-150 ${
                        isActive
                          ? 'bg-slate-800 text-white font-medium border border-slate-700'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.5} aria-hidden="true" />
                      <span>{link.label}</span>
                    </SmartLink>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-6">{children || <Outlet />}</main>
        </div>
      </div>
    </div>
  );
}
