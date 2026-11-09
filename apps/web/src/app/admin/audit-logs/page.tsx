'use client';

import React from 'react';
import { mockDb } from '@lootupspace/database';
import { formatDate } from '../../../lib/utils';
import { Terminal } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const logs = mockDb.auditLogs;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400">Security & Compliance</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5 focus:outline-2 focus:outline-transparent">
            Security Trail & Audit Ledger
          </h1>
          <p className="text-xs text-slate-400">
            Immutable log of system actions, role elevation events, driver dispatches, and pricing updates.
          </p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div tabIndex={0} role="region" aria-label="Security audit ledger table" className="overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="visually-hidden">Immutable trail of system security and operational audit events</caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th scope="col" className="py-3 px-3 font-semibold">Action Event</th>
                <th scope="col" className="py-3 px-3 font-semibold">Resource</th>
                <th scope="col" className="py-3 px-3 font-semibold">Details</th>
                <th scope="col" className="py-3 px-3 font-semibold">IP Address</th>
                <th scope="col" className="py-3 px-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors duration-150">
                  <th scope="row" className="py-3 px-3 font-bold text-rose-300 text-left">
                    <span className="inline-flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                      <span>{log.action}</span>
                    </span>
                  </th>
                  <td className="py-3 px-3 text-slate-300">{log.resource}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{log.details}</td>
                  <td className="py-3 px-3 text-slate-500">{log.ipAddress}</td>
                  <td className="py-3 px-3 text-right text-slate-500 font-sans">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

