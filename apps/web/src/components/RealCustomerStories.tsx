import React, { useState, useId, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { SmartLink } from './SmartLink';

export function RealCustomerStories() {
  const [activeStory, setActiveStory] = useState<number>(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const stories = [
    {
      name: 'Pooja Hegde',
      role: 'Product Designer',
      locality: 'Indiranagar, Bengaluru',
      tag: 'Apartment Space Recovery',
      headline: 'We turned our cluttered spare room into a sunlit reading studio.',
      quote:
        'Our 2BHK flat was suffocating under 4 heavy winter quilts, 3 large travel trolleys, and Diwali puja utensils used once a year. Storing them with Lootupspace took 20 minutes: the driver came with boxes, taped them with barcodes, and our floor was clear. Best ₹598/month we spend.',
      itemsStored: '3 Heavy Wardrobe Boxes + 2 Luggage Trolleys (12.4 cu ft)',
      monthlyCost: '₹598/month',
      spaceGained: '18 sq ft floor space recovered',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
    },
    {
      name: 'Rohan & Sneha Mehta',
      role: 'Fintech Product Lead & Architect',
      locality: 'Hiranandani, Powai, Mumbai',
      tag: 'Lease Gap & Transition',
      headline: 'Saved ₹18,000 during our 3-week tenancy gap between apartments.',
      quote:
        'Our lease expired on the 10th and our new flat was not ready until the 1st of next month. Packers & movers quoted an exorbitant daily detention fee. Lootupspace took 14 boxes and our dining table, stored them in their climate-controlled Powai vault, and delivered them to our new doorstep on schedule without a scratch.',
      itemsStored: 'Dining Set + 8 Double-wall Cartons + Monitor (28 cu ft)',
      monthlyCost: '₹1,690/month',
      spaceGained: 'Seamless doorstep transition',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'
    },
    {
      name: 'Karthik Subramanian',
      role: 'Software Architect',
      locality: 'OMR Perungudi, Chennai',
      tag: 'Seasonal & Sports Gear',
      headline: 'My expensive road bike and scuba kit are safe and dry through coastal monsoons.',
      quote:
        'Salt air and monsoons in Chennai ruin bicycles and leather gear left on balconies. Having a 24/7 climate vault where humidity is kept below 50% gives total peace of mind. Whenever I have an outstation cycling weekend, I tap return on Friday and the bike is at my gate.',
      itemsStored: 'Trek Road Bike + Scuba Kitbag + 2 Tech Boxes (16 cu ft)',
      monthlyCost: '₹749/month',
      spaceGained: 'Protected from coastal rust & moisture',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80'
    }
  ];

  const current = stories[activeStory];

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight') nextIndex = (activeStory + 1) % stories.length;
    else if (e.key === 'ArrowLeft') nextIndex = (activeStory - 1 + stories.length) % stories.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = stories.length - 1;

    if (nextIndex !== -1) {
      e.preventDefault();
      setActiveStory(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Real Case Studies</span>
          <h2 className="text-2xl font-medium text-white tracking-tight mt-1 text-balance">
            How urban residents live larger in metro apartments
          </h2>
        </div>

        {/* WAI-ARIA Story Selector Tabs */}
        <div
          role="tablist"
          aria-label="Customer case studies"
          onKeyDown={handleTabKeyDown}
          className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs"
        >
          {stories.map((story, idx) => {
            const isSelected = activeStory === idx;
            return (
              <button
                key={story.name}
                ref={(el) => { tabRefs.current[idx] = el; }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${idx}`}
                aria-selected={isSelected}
                aria-controls={`${baseId}-panel`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveStory(idx)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {story.name.split(' ')[0]} ({story.locality.split(',')[1]?.trim() || 'Metro'})
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${activeStory}`}
        tabIndex={0}
        key={activeStory}
        className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in"
      >
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span>{current.tag}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-medium text-slate-100 leading-snug text-balance">
            &ldquo;{current.headline}&rdquo;
          </h3>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-pretty">
            {current.quote}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 shrink-0">
              <img
                src={current.image}
                alt={current.name}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-sm text-white">{current.name}</div>
              <div className="text-xs text-slate-400 font-mono">
                {current.role} · {current.locality}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            Vault Manifest Summary
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-400 text-[11px] font-mono">Stored items:</div>
              <div className="text-slate-200 font-medium mt-0.5">{current.itemsStored}</div>
            </div>

            <div>
              <div className="text-slate-400 text-[11px] font-mono">Monthly storage fee:</div>
              <div className="font-mono text-base font-semibold text-emerald-400 mt-0.5">
                {current.monthlyCost}
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[11px] font-mono">Outcome:</div>
              <div className="text-lootup-300 font-medium mt-0.5">{current.spaceGained}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <SmartLink
              href="/customer/items/new"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Schedule similar pickup</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </SmartLink>
          </div>
        </div>
      </div>
    </div>
  );
}
