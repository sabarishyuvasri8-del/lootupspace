import React, { useId, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { mockDb } from '@lootupspace/database';
import { MapPin, ShieldCheck, Globe, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState('en');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const langSelectId = useId();

  const referralCode = 'AARAV200';

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://lootup.space/join?ref=${referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-lootup-600">Account Settings</span>
        <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
          Profile, KYC &amp; Addresses
        </h1>
        <p className="text-xs text-slate-500 text-pretty">
          Manage your personal details, KYC identification, delivery addresses, and referral rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile & Addresses */}
        <div className="lg:col-span-7 space-y-6">
          {/* User Details */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-sm">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Full Name</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900">
                  {user?.name || 'Aarav Sharma'}
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Registered Phone</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-slate-900">
                  {user?.phone || '+919876543210'}
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Email Address</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-900">
                  {user?.email || 'customer@lootup.space'}
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Role &amp; Privilege</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-lootup-700">
                  Customer (Verified Member)
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-sm">Saved Doorstep Addresses</h2>
            <div className="space-y-3">
              {mockDb.addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-lootup-600" aria-hidden="true" />
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-lootup-100 text-lootup-800 font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{addr.line1}, {addr.line2}</p>
                  <p className="text-slate-500 text-[11px]">
                    Landmark: {addr.landmark} • {addr.city} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: KYC, Language & Referral */}
        <div className="lg:col-span-5 space-y-6">
          {/* KYC Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              <h2 className="font-bold text-slate-900 text-sm">KYC Identity Verification</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-pretty">
              Required under Indian warehousing regulations for high-value vault storage and insurance claim settlements.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0" aria-hidden="true">
                <Check className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-emerald-950">Aadhaar Card Verified</div>
                <div className="text-[11px] text-emerald-800">UID: XXXX-XXXX-4819 • Stored Encrypted</div>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-lootup-600" aria-hidden="true" />
              <label htmlFor={langSelectId} className="font-bold text-slate-900 text-sm">
                Language Preference (भाषा)
              </label>
            </div>
            <select
              id={langSelectId}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
            >
              <option value="en">English (Indian Standard)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Refer & Earn */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-semibold text-accent block">
              Refer &amp; Earn ₹200
            </span>
            <h2 className="font-bold text-slate-900 text-sm">Give ₹100, Get ₹200 Storage Credit</h2>
            <p className="text-xs text-slate-600 leading-relaxed text-pretty">
              Share your personal link with friends or flatmates moving homes. When they complete their first pickup, both of you earn storage wallet credits.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono font-bold text-xs text-slate-900 text-center">
                {referralCode}
              </div>
              <button
                type="button"
                onClick={copyReferral}
                aria-live="polite"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors duration-150"
              >
                {copiedReferral ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

