import React from 'react';
import { Navbar } from '../../components/Navbar';
import { CustomerBottomNav } from '../../components/CustomerBottomNav';
import { useAuth } from '../../lib/auth-context';
import { Package, Boxes, Calendar, CreditCard, User, HelpCircle, LogOut } from 'lucide-react';
import { usePathname, Outlet } from '../../lib/navigation';
import { SmartLink } from '../../components/SmartLink';

export default function CustomerLayout({ children }: { children?: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { label: 'Storage overview', href: '/customer', icon: Package },
    { label: 'Digital inventory', href: '/customer/inventory', icon: Boxes },
    { label: 'Add item to vault', href: '/customer/items/new', icon: Calendar },
    { label: 'Billing and invoices', href: '/customer/billing', icon: CreditCard },
    { label: 'Profile and KYC', href: '/customer/profile', icon: User },
    { label: 'Support and tickets', href: '/customer/support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 lg:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-medium text-sm" aria-hidden="true">
                  {user?.name?.charAt(0) || 'C'}
                </div>
                <div className="overflow-hidden">
                  <div className="font-medium text-slate-900 text-sm truncate">{user?.name || 'Customer'}</div>
                  <div className="text-xs text-slate-500 font-mono truncate">{user?.phone}</div>
                </div>
              </div>

              <nav aria-label="Account" className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <SmartLink
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
                        isActive
                          ? 'bg-slate-100 text-slate-950 font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.5} aria-hidden="true" />
                      <span>{link.label}</span>
                    </SmartLink>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>

            {/* Quick Vault Info Card */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white text-xs space-y-1.5 text-slate-600">
              <div className="font-medium text-slate-900">Custody hub</div>
              <div className="text-[11px] text-slate-500">Indiranagar Sector 2, Bengaluru</div>
              <div className="text-[11px] font-mono text-emerald-700"><span aria-hidden="true">● </span>24/7 CCTV &amp; sensor guard</div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            {children || <Outlet />}
          </main>
        </div>
      </div>

      <CustomerBottomNav />
    </div>
  );
}
