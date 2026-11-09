import React, { useId, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Check } from 'lucide-react';

export default function ForBusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [estimatedSpace, setEstimatedSpace] = useState('50 - 200 cu ft');
  const formId = useId();
  const companyId = `${formId}-company`;
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const phoneId = `${formId}-phone`;
  const spaceId = `${formId}-space`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-lootup-600">Enterprise & Small Business</span>
          <h1
            id="main-content"
            tabIndex={-1}
            className="text-3xl sm:text-5xl font-semibold text-slate-900 tracking-tight text-balance"
          >
            Micro-Warehousing for Modern Businesses
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto text-pretty">
            Store office furniture, tax binders, e-commerce excess stock, marketing event booths, and retail inventory without signing expensive 3-year commercial leases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* B2B Benefits */}
          <div id="inventory" className="lg:col-span-7 space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-semibold text-slate-900">Why Metro Businesses Choose Us</h2>

            <div className="space-y-4">
              {[
                {
                  title: 'Flexible Pay-As-You-Grow Invoicing',
                  desc: 'Scale up or down monthly as your inventory surges during festive quarters (Diwali, New Year) with zero long-term commitments.'
                },
                {
                  title: '18% GST Input Tax Credit (ITC)',
                  desc: 'Every monthly cycle generates a detailed GST tax invoice with SAC code 996729, ready for your accounting team.'
                },
                {
                  title: 'Dedicated Vault Zones',
                  desc: 'Store confidential HR files, patent records, and prototypes in our biometric High-Value Vault with tamper-proof security seals.'
                },
                {
                  title: 'Palletized & Bulk Pickup Fleets',
                  desc: 'From Tata Ace to heavy multi-axle trucks, our logistics fleet manages heavy commercial dispatches across city hubs.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-lootup-100 text-lootup-700 flex items-center justify-center shrink-0" aria-hidden="true">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed text-pretty">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Form */}
          <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-md" aria-live="polite">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Request B2B Quote</h2>
            <p className="text-xs text-slate-500 mb-6 text-pretty">Our corporate solutions manager will reach out within 4 business hours.</p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto" aria-hidden="true">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm">Quote Request Received!</h3>
                <p className="text-xs text-emerald-700 text-pretty">Thank you, {name}. We will review {company}&apos;s storage requirements and dispatch an enterprise quotation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor={companyId} className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Firm Name
                  </label>
                  <input
                    id={companyId}
                    name="organization"
                    required
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
                  />
                </div>

                <div>
                  <label htmlFor={nameId} className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    id={nameId}
                    name="name"
                    required
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Nair (Operations Manager)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={emailId} className="block text-xs font-semibold text-slate-700 mb-1">
                      Work Email
                    </label>
                    <input
                      id={emailId}
                      name="email"
                      required
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="work@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor={phoneId} className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Mobile
                    </label>
                    <input
                      id={phoneId}
                      name="tel"
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={spaceId} className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Storage Space Required
                  </label>
                  <select
                    id={spaceId}
                    name="estimatedSpace"
                    value={estimatedSpace}
                    onChange={(e) => setEstimatedSpace(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent bg-white"
                  >
                    <option value="50 - 200 cu ft">50 - 200 cu ft (10-25 boxes)</option>
                    <option value="200 - 500 cu ft">200 - 500 cu ft (Office archives or desks)</option>
                    <option value="500 - 2000 cu ft">500 - 2000 cu ft (Multiple rooms / retail inventory)</option>
                    <option value="2000+ cu ft">2000+ cu ft (Large enterprise warehouse zone)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors duration-150"
                >
                  Submit Enterprise Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

