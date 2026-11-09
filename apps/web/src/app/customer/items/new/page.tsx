import React, { useId, useState, useMemo, Suspense } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { usePickupCart } from '../../../../lib/store';
import { RestrictedItemsWarning } from '../../../../components/RestrictedItemsWarning';
import {
  ItemCategory,
  SizeTier,
  DimensionUnit,
  DEFAULT_PRICING_TIERS,
  calculateCubicFeet,
  determineSizeTier,
  calculateItemMonthlyPrice
} from '@lootupspace/shared';
import { formatInr } from '../../../../lib/utils';
import {
  Camera,
  Plus,
  Trash2,
  ArrowRight,
  Boxes
} from 'lucide-react';
import { useSearchParams } from '../../../../lib/navigation';
import { SmartLink } from '../../../../components/SmartLink';

function AddItemContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ItemCategory) || ItemCategory.CLOTHES;

  const { user: _user } = useAuth();
  const { cartItems, addItemToCart, removeItemFromCart } = usePickupCart();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>(initialCategory);
  const [description, setDescription] = useState('');
  const [sizeMode, setSizeMode] = useState<'TIER' | 'DIMENSIONS'>('TIER');
  const [sizeTier, setSizeTier] = useState<SizeTier>(SizeTier.MEDIUM_BOX);

  // Dimensions
  const [length, setLength] = useState(50);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(30);
  const [unit, setUnit] = useState<DimensionUnit>(DimensionUnit.CM);
  const [weightKg, setWeightKg] = useState(6.0);
  const [quantity, setQuantity] = useState(1);
  const [declaredValueInr, setDeclaredValueInr] = useState(5000);
  const [isFragile, setIsFragile] = useState(false);
  const [needsSpecialHandling, setNeedsSpecialHandling] = useState(false);
  const [packingRequired, setPackingRequired] = useState(false);
  const [notes] = useState('');

  // Sample Photos (preloaded with realistic Indian metro storage photos for instant demo delight)
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80'
  ]);
  const [acknowledgedProhibited, setAcknowledgedProhibited] = useState(false);
  const [error, setError] = useState('');

  const formId = useId();
  const nameId = `${formId}-name`;
  const categoryId = `${formId}-category`;
  const descId = `${formId}-desc`;
  const lengthId = `${formId}-length`;
  const widthId = `${formId}-width`;
  const heightId = `${formId}-height`;
  const valueId = `${formId}-value`;
  const weightId = `${formId}-weight`;
  const qtyId = `${formId}-qty`;

  // Real-time calculated volume & price
  const calculatedCubicFeet = useMemo(() => {
    if (sizeMode === 'DIMENSIONS') {
      return calculateCubicFeet(length, width, height, unit);
    }
    return DEFAULT_PRICING_TIERS[sizeTier].maxCubicFeet;
  }, [sizeMode, length, width, height, unit, sizeTier]);

  const resolvedTier = useMemo(() => {
    if (sizeMode === 'DIMENSIONS') {
      return determineSizeTier(calculatedCubicFeet);
    }
    return sizeTier;
  }, [sizeMode, calculatedCubicFeet, sizeTier]);

  const monthlyPricePerUnit = useMemo(() => {
    return calculateItemMonthlyPrice(resolvedTier, calculatedCubicFeet);
  }, [resolvedTier, calculatedCubicFeet]);

  const handleAddPhoto = () => {
    const samplePool = [
      'https://images.unsplash.com/photo-1580481077195-73ab013f636f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80'
    ];
    if (photos.length < 8) {
      const nextPhoto = samplePool[photos.length % samplePool.length];
      setPhotos([...photos, nextPhoto]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a descriptive item or box name');
      return;
    }
    if (photos.length < 2) {
      setError('Please upload at least 2 clear photos (minimum 2, maximum 8)');
      return;
    }
    if (!acknowledgedProhibited) {
      setError('Please review and tick the prohibited items declaration below');
      return;
    }

    const item = {
      id: `cart_item_${Date.now()}`,
      name,
      category,
      description,
      length,
      width,
      height,
      unit,
      weightKg,
      quantity,
      declaredValueInr,
      isFragile,
      needsSpecialHandling,
      packingRequired,
      notes,
      sizeTier: resolvedTier,
      cubicFeet: calculatedCubicFeet,
      monthlyStorageFeeInr: monthlyPricePerUnit * quantity,
      photos
    };

    addItemToCart(item);
    // Reset form for next item
    setName('');
    setDescription('');
    setPhotos([
      'https://images.unsplash.com/photo-1580481077195-73ab013f636f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    ]);
    setError('');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-lootup-600">Step 1 of 2</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
            Photo &amp; Add Items to Storage Cart
          </h1>
          <p className="text-xs text-slate-500 text-pretty">
            Photograph your items. Our transparent engine provides instant monthly storage quotes.
          </p>
        </div>

        {cartItems.length > 0 && (
          <SmartLink
            href="/customer/pickup/new"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-accent/25 transition-colors duration-150 active:scale-95"
          >
            <span>Proceed to Schedule Pickup ({cartItems.length} items)</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </SmartLink>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handleAddToCart} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {error && (
            <div role="alert" className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* 1. Item Photos Uploader (2 to 8 photos) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-slate-700">
                1. Item Photos ({photos.length}/8 uploaded • min 2 required)
              </span>
              <span className="text-[11px] text-slate-500">Front, side, and condition details</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((url, idx) => (
                <div key={idx} className="relative h-28 rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img
                    src={url}
                    alt={`Uploaded item preview ${idx + 1}`}
                    width={240}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Photo {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    aria-label={`Remove photo ${idx + 1}`}
                    className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}

              {photos.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="h-28 rounded-2xl border-2 border-dashed border-lootup-300 hover:border-lootup-500 bg-lootup-50/50 hover:bg-lootup-50 flex flex-col items-center justify-center text-lootup-700 transition-colors duration-150"
                >
                  <Camera className="w-6 h-6 mb-1 text-lootup-600" aria-hidden="true" />
                  <span className="text-xs font-bold">Add Photo</span>
                  <span className="text-[10px] text-slate-500">+ Camera / Gallery</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={nameId} className="block text-xs font-semibold text-slate-700 mb-1">
                Item / Box Name
              </label>
              <input
                id={nameId}
                required
                type="text"
                placeholder="e.g. Winter Down Jackets & Quilts"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
              />
            </div>

            <div>
              <label htmlFor={categoryId} className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                id={categoryId}
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent bg-white"
              >
                {Object.values(ItemCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={descId} className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description (Optional)
            </label>
            <textarea
              id={descId}
              rows={2}
              placeholder="e.g. 4 heavy woolen jackets in vacuum seal bags, 2 cashmere quilts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
            />
          </div>

          {/* 3. Size Tier vs Dimensions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="block text-xs font-bold text-slate-700">
                2. Size &amp; Volume Determination
              </span>
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  aria-pressed={sizeMode === 'TIER'}
                  onClick={() => setSizeMode('TIER')}
                  className={`px-3 py-1 rounded-lg transition-colors duration-150 ${sizeMode === 'TIER' ? 'bg-white text-lootup-700 shadow-sm' : 'text-slate-600'}`}
                >
                  Standard Box Tier
                </button>
                <button
                  type="button"
                  aria-pressed={sizeMode === 'DIMENSIONS'}
                  onClick={() => setSizeMode('DIMENSIONS')}
                  className={`px-3 py-1 rounded-lg transition-colors duration-150 ${sizeMode === 'DIMENSIONS' ? 'bg-white text-lootup-700 shadow-sm' : 'text-slate-600'}`}
                >
                  Dimensions (L×W×H)
                </button>
              </div>
            </div>

            {sizeMode === 'TIER' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(DEFAULT_PRICING_TIERS).filter(([k]) => k !== SizeTier.CUSTOM).map(([tKey, t]) => (
                  <button
                    key={tKey}
                    type="button"
                    aria-pressed={sizeTier === tKey}
                    onClick={() => setSizeTier(tKey as SizeTier)}
                    className={`cursor-pointer p-3 rounded-2xl border-2 text-center transition-colors duration-150 ${
                      sizeTier === tKey
                        ? 'border-lootup-600 bg-lootup-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm font-semibold text-lootup-900 mt-1 tabular-nums">{formatInr(t.monthlyRateInr)}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Up to {t.maxCubicFeet} cu ft</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Unit of Measure</span>
                  <div className="flex gap-1 bg-white p-1 rounded-lg border text-xs">
                    {(['CM', 'INCH', 'FT'] as DimensionUnit[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        aria-pressed={unit === u}
                        onClick={() => setUnit(u)}
                        className={`px-2 py-0.5 rounded font-bold ${unit === u ? 'bg-lootup-600 text-white' : 'text-slate-600'}`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor={lengthId} className="text-[11px] font-semibold text-slate-600">Length ({unit})</label>
                    <input
                      id={lengthId}
                      type="number"
                      min={1}
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor={widthId} className="text-[11px] font-semibold text-slate-600">Width ({unit})</label>
                    <input
                      id={widthId}
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor={heightId} className="text-[11px] font-semibold text-slate-600">Height ({unit})</label>
                    <input
                      id={heightId}
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600">Volume: <strong className="tabular-nums">{calculatedCubicFeet} cu ft</strong></span>
                  <span className="text-lootup-800 font-bold">Auto-mapped to: {DEFAULT_PRICING_TIERS[resolvedTier].name}</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Specifications: Value, Quantity, Fragile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label htmlFor={valueId} className="block text-xs font-semibold text-slate-700 mb-1">Declared Value (₹)</label>
              <input
                id={valueId}
                type="number"
                min={0}
                value={declaredValueInr}
                onChange={(e) => setDeclaredValueInr(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                title="Used for insurance coverage"
              />
            </div>

            <div>
              <label htmlFor={weightId} className="block text-xs font-semibold text-slate-700 mb-1">Estimated Weight (kg)</label>
              <input
                id={weightId}
                type="number"
                min={0.1}
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label htmlFor={qtyId} className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
              <input
                id={qtyId}
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Handling checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isFragile}
                onChange={(e) => setIsFragile(e.target.checked)}
                className="w-4 h-4 text-lootup-600 rounded"
              />
              <span>Fragile Glass / Art</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={needsSpecialHandling}
                onChange={(e) => setNeedsSpecialHandling(e.target.checked)}
                className="w-4 h-4 text-lootup-600 rounded"
              />
              <span>Electronics / Battery</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={packingRequired}
                onChange={(e) => setPackingRequired(e.target.checked)}
                className="w-4 h-4 text-lootup-600 rounded"
              />
              <span>We Pack (+₹249)</span>
            </label>
          </div>

          {/* Prohibited items warning and declaration */}
          <RestrictedItemsWarning
            acknowledged={acknowledgedProhibited}
            onAcknowledge={setAcknowledgedProhibited}
          />

          {/* Add to Cart Submit */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Monthly Storage Rate for this item:</span>
              <span className="text-2xl font-semibold text-slate-900 tabular-nums">{formatInr(monthlyPricePerUnit * quantity)} / mo</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-lootup-600 hover:bg-lootup-700 text-white font-bold text-sm shadow-md transition-colors duration-150 active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add to Pickup Cart</span>
            </button>
          </div>
        </form>

        {/* Right Cart Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-lootup-600" aria-hidden="true" />
              <h2 className="font-bold text-slate-900 text-sm">Pickup Cart ({cartItems.length})</h2>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Boxes className="w-8 h-8 mx-auto text-slate-300" aria-hidden="true" />
              <p className="text-xs">Your pickup cart is currently empty.</p>
              <p className="text-[11px] text-slate-500 text-pretty">Fill the form and tap &quot;Add to Pickup Cart&quot; to queue items for collection.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={item.photos[0]}
                        alt={item.name}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {item.sizeTier.replace('_', ' ')} • {item.quantity}x
                        </div>
                        <div className="text-[11px] font-bold text-lootup-700 tabular-nums">
                          {formatInr(item.monthlyStorageFeeInr)}/mo
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItemFromCart(item.id)}
                      aria-label={`Remove ${item.name} from pickup cart`}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Items:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Monthly Storage:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatInr(cartItems.reduce((acc, it) => acc + it.monthlyStorageFeeInr, 0))}
                  </span>
                </div>
              </div>

              <SmartLink
                href="/customer/pickup/new"
                className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-accent/25 transition-colors duration-150 active:scale-95"
              >
                <span>Proceed to Schedule Pickup</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </SmartLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddItemPage() {
  return (
    <Suspense fallback={<div role="status" className="p-12 text-center text-slate-500">Loading item uploader...</div>}>
      <AddItemContent />
    </Suspense>
  );
}
