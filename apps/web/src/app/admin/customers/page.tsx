'use client';

import React, { useState, useId } from 'react';
import { mockDb } from '@lootupspace/database';
import { ShieldCheck, Search } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(
    mockDb.users.filter((u) => u.role === 'CUSTOMER')
  );
  const [search, setSearch] = useState('');
  const searchId = useId();

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    const updated = customers.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        };
      }
      return c;
    });
    setCustomers(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400">Member Accounts</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Customer Directory & KYC Ledger
          </h1>
          <p className="text-xs text-slate-400">
            View customer vault profiles, stored item counts, KYC verification states, and account status.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <search aria-label="Filter customers" className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" aria-hidden="true" />
        <label htmlFor={searchId} className="visually-hidden">
          Search customers by name, mobile number, or email
        </label>
        <input
          id={searchId}
          type="text"
          placeholder="Search by customer name, mobile number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent flex-1 text-xs text-white px-2 py-1 rounded-lg focus:outline-2 focus:outline-transparent focus:ring-2 focus:ring-rose-500"
        />
      </search>

      {/* Customers Table */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div tabIndex={0} role="region" aria-label="Customer directory table" className="overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="visually-hidden">Customer directory and KYC verification ledger</caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th scope="col" className="py-3 px-3 font-semibold">Customer</th>
                <th scope="col" className="py-3 px-3 font-semibold">Phone & Email</th>
                <th scope="col" className="py-3 px-3 font-semibold">KYC Verification</th>
                <th scope="col" className="py-3 px-3 font-semibold">Stored Items</th>
                <th scope="col" className="py-3 px-3 font-semibold">Referral Code</th>
                <th scope="col" className="py-3 px-3 font-semibold">Status</th>
                <th scope="col" className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => {
                const itemsCount = mockDb.storageItems.filter((i) => i.userId === c.id).length;
                return (
                  <tr key={c.id} className="hover:bg-slate-900/50 transition-colors duration-150">
                    <th scope="row" className="py-3.5 px-3 font-bold text-white text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs" aria-hidden="true">
                          {c.name?.charAt(0) || 'U'}
                        </div>
                        <span>{c.name}</span>
                      </div>
                    </th>
                    <td className="py-3.5 px-3 text-slate-300">
                      <div className="font-mono text-slate-200">{c.phone}</div>
                      <div className="text-[10px] text-slate-400">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                        Aadhaar Verified
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-200 font-bold">{itemsCount} Pieces</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-rose-400">{c.referralCode}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(c.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors duration-150"
                      >
                        {c.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

