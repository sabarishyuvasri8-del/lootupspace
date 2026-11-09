'use client';

import React from 'react';
import { Home, Boxes, Plus, CreditCard, User } from 'lucide-react';
import { usePathname } from '../lib/navigation';
import { SmartLink } from './SmartLink';

export function CustomerBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/customer', icon: Home, active: pathname === '/customer' },
    { label: 'Items', href: '/customer/inventory', icon: Boxes, active: pathname.startsWith('/customer/inventory') },
    { label: 'Add item', href: '/customer/items/new', icon: Plus, active: pathname.startsWith('/customer/items/new'), isCta: true },
    { label: 'Billing', href: '/customer/billing', icon: CreditCard, active: pathname.startsWith('/customer/billing') },
    { label: 'Profile', href: '/customer/profile', icon: User, active: pathname.startsWith('/customer/profile') }
  ];

  return (
    <nav aria-label="Account quick bar" className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 py-1.5 px-3 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isCta) {
            return (
              <SmartLink
                key={item.href}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className="flex flex-col items-center -mt-4"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center transition-colors duration-150 active:scale-[0.98]" aria-hidden="true">
                  <Plus className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-slate-700 mt-0.5">{item.label}</span>
              </SmartLink>
            );
          }

          return (
            <SmartLink
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={`flex flex-col items-center py-1 px-2 rounded transition-colors duration-150 ${
                item.active ? 'text-slate-950 font-medium' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[10px]">{item.label}</span>
            </SmartLink>
          );
        })}
      </div>
    </nav>
  );
}
