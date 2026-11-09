'use client';

import React from 'react';
import { useAuth } from '../lib/auth-context';
import { UserRole } from '@lootupspace/shared';
import { ShieldCheck, Truck, Warehouse, User, MapPin } from 'lucide-react';
import { useRouter } from '../lib/navigation';

export function RoleSwitcherBanner() {
  const { role, demoLogin } = useAuth();
  const router = useRouter();

  const handleRoleChange = async (targetRole: UserRole) => {
    await demoLogin(targetRole);
    if (targetRole === UserRole.CUSTOMER) {
      router.push('/customer');
    } else if (targetRole === UserRole.DRIVER) {
      router.push('/driver');
    } else if (targetRole === UserRole.WAREHOUSE) {
      router.push('/warehouse');
    } else if (targetRole === UserRole.ADMIN) {
      router.push('/admin');
    }
  };

  const roles = [
    { role: UserRole.CUSTOMER, label: 'Customer', icon: User },
    { role: UserRole.DRIVER, label: 'Driver', icon: Truck },
    { role: UserRole.WAREHOUSE, label: 'Warehouse', icon: Warehouse },
    { role: UserRole.ADMIN, label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <div className="bg-slate-950 text-slate-300 text-xs px-4 py-2 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
            <span className="font-medium text-slate-300">Lootupspace suite</span>
          </div>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} aria-hidden="true" />
            <span>Serving Bengaluru, Mumbai, and Chennai</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Role view:</span>
          {roles.map(({ role: r, label, icon: Icon }) => {
            const isActive = role === r;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleRoleChange(r)}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
