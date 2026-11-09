import React, { useId, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { UserRole } from '@lootupspace/shared';
import { Package, Shield, ArrowRight, Truck, Warehouse } from 'lucide-react';
import { useRouter } from '../../../lib/navigation';
import { SmartLink } from '../../../components/SmartLink';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('+919876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formId = useId();
  const phoneId = `${formId}-phone`;
  const otpId = `${formId}-otp`;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(phone, enteredOtp);
      router.push('/customer');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = async (role: UserRole) => {
    setLoading(true);
    await demoLogin(role);
    if (role === UserRole.CUSTOMER) router.push('/customer');
    else if (role === UserRole.DRIVER) router.push('/driver');
    else if (role === UserRole.WAREHOUSE) router.push('/warehouse');
    else if (role === UserRole.ADMIN) router.push('/admin');
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <SmartLink href="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-lootup-500 text-white flex items-center justify-center font-bold shadow-lg shadow-lootup-500/30" aria-hidden="true">
            <Package className="w-7 h-7" />
          </div>
          <span className="text-3xl font-semibold text-white">
            Lootup<span className="text-accent">space</span>
          </span>
        </SmartLink>
        <h1
          id="main-content"
          tabIndex={-1}
          className="text-xl font-bold text-slate-200 text-balance"
        >
          Sign In to Your Storage Vault
        </h1>
        <p className="text-xs text-slate-400 text-pretty">
          Manage your stored items, track pickups, and request return deliveries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div role="alert" className="p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
              {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor={phoneId} className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-semibold">
                    🇮🇳
                  </span>
                  <input
                    id={phoneId}
                    name="tel"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium text-sm focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">We will send a 6-digit OTP via SMS / WhatsApp.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-sm shadow-lg shadow-accent/25 transition-colors duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Continue with OTP</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Code sent to: <strong className="text-white">{phone}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-lootup-400 hover:underline font-semibold"
                >
                  Change
                </button>
              </div>

              <div>
                <label htmlFor={otpId} className="block text-xs font-bold text-slate-300 mb-1.5">
                  Enter 6-Digit OTP
                </label>
                <input
                  id={otpId}
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full tracking-widest text-center text-2xl font-mono py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
                />
                <p className="text-[11px] text-emerald-400 mt-1"><span aria-hidden="true">💡 </span>Demo OTP is prefilled as <strong>123456</strong></p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-sm shadow-lg shadow-accent/25 transition-colors duration-150 active:scale-[0.98]"
              >
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>
            </form>
          )}

          {/* Instant 1-Click Role Switcher Demo */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 block text-center">
              Or One-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleInstantDemo(UserRole.CUSTOMER)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors duration-150"
              >
                <Package className="w-3.5 h-3.5 text-lootup-400" aria-hidden="true" />
                Customer
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemo(UserRole.DRIVER)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors duration-150"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                Driver (PWA)
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemo(UserRole.WAREHOUSE)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors duration-150"
              >
                <Warehouse className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                Warehouse
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemo(UserRole.ADMIN)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors duration-150"
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
                Admin Ops
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

