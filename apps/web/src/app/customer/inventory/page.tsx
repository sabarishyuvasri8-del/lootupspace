import React, { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { mockDb } from '@lootupspace/database';
import { StorageItemStatus, ItemCategory } from '@lootupspace/shared';
import { formatInr, formatDate } from '../../../lib/utils';
import { QrCodeDisplay } from '../../../components/QrCodeDisplay';
import {
  Boxes,
  Search,
  RotateCcw,
  PlusCircle,
  Eye,
  X
} from 'lucide-react';
import { useRouter } from '../../../lib/navigation';
import { SmartLink } from '../../../components/SmartLink';

export default function DigitalInventoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedItemForModal, setSelectedItemForModal] = useState<any>(null);
  const [selectedItemIdsForReturn, setSelectedItemIdsForReturn] = useState<string[]>([]);
  const modalRef = useRef<HTMLDialogElement>(null);
  const filterId = useId();
  const searchInputId = `${filterId}-search`;
  const categorySelectId = `${filterId}-category`;
  const statusSelectId = `${filterId}-status`;
  const modalHeadingId = `${filterId}-modal-heading`;

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    if (selectedItemForModal) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedItemForModal]);

  const customerItems = mockDb.storageItems.filter(
    (i) => i.userId === (user?.id || 'user_cust_001')
  );

  const filteredItems = customerItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      item.qrCode.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleItemSelection = (id: string) => {
    if (selectedItemIdsForReturn.includes(id)) {
      setSelectedItemIdsForReturn(selectedItemIdsForReturn.filter((i) => i !== id));
    } else {
      setSelectedItemIdsForReturn([...selectedItemIdsForReturn, id]);
    }
  };

  const handleProceedToReturn = () => {
    if (selectedItemIdsForReturn.length > 0) {
      router.push(`/customer/returns/new?items=${selectedItemIdsForReturn.join(',')}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-slate-500">Digital inventory</div>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-medium text-slate-950 tracking-tight mt-0.5 text-balance" aria-live="polite">
            Stored belongings ({filteredItems.length})
          </h1>
          <p className="text-xs text-slate-500 text-pretty">
            Cataloged photos, custody barcodes, and assigned warehouse bin locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedItemIdsForReturn.length > 0 ? (
            <button
              type="button"
              onClick={handleProceedToReturn}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 active:scale-[0.98] flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              <span>Request return ({selectedItemIdsForReturn.length})</span>
            </button>
          ) : (
            <SmartLink
              href="/customer/items/new"
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              <span>Add item to vault</span>
            </SmartLink>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <search aria-label="Filter stored belongings" className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <label htmlFor={searchInputId} className="visually-hidden">
            Search stored items by name or barcode
          </label>
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
          <input
            id={searchInputId}
            type="search"
            placeholder="Search by item name or barcode"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-900 focus:outline-2 focus:outline-transparent font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor={categorySelectId} className="visually-hidden">Filter by category</label>
          <select
            id={categorySelectId}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus:outline-2 focus:outline-transparent"
          >
            <option value="ALL">All categories</option>
            {Object.values(ItemCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat.toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>

          <label htmlFor={statusSelectId} className="visually-hidden">Filter by status</label>
          <select
            id={statusSelectId}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus:outline-2 focus:outline-transparent"
          >
            <option value="ALL">All statuses</option>
            <option value={StorageItemStatus.STORED}>Stored in vault</option>
            <option value={StorageItemStatus.RETURN_REQUESTED}>Return requested</option>
            <option value={StorageItemStatus.RETURNED}>Returned</option>
          </select>
        </div>
      </search>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 space-y-2">
          <Boxes className="w-8 h-8 mx-auto text-slate-300" strokeWidth={1.5} aria-hidden="true" />
          <div className="font-medium text-slate-700 text-sm">No items found</div>
          <p className="text-xs text-slate-500">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedItemIdsForReturn.includes(item.id);
            const isStored = item.status === StorageItemStatus.STORED;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 border transition-colors duration-150 shadow-sm space-y-3.5 relative ${
                  isSelected ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/40' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Photo & Badge */}
                <div className="h-40 rounded-lg overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    width={600}
                    height={320}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {item.qrCode}
                  </div>

                  <span className={`absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.status === StorageItemStatus.STORED
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {item.status.toLowerCase().replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-medium text-slate-900 text-sm leading-snug truncate">{item.name}</h2>
                    <span className="text-xs font-mono font-medium text-slate-900 tabular-nums shrink-0">
                      {formatInr(item.monthlyStorageFeeInr)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 text-pretty">{item.description}</p>
                </div>

                {/* Shelf & Volume */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Shelf bin</span>
                    <span className="text-slate-800 font-mono text-[11px] font-medium">{item.binCode || 'In transit'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Volume</span>
                    <span className="text-slate-800 font-mono text-[11px] font-medium">{item.cubicFeet} cu ft</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedItemForModal(item)}
                    className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>View details</span>
                  </button>

                  {isStored && (
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select for return'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Native Dialog */}
      <dialog
        ref={modalRef}
        className="modal-dialog max-w-lg"
        aria-labelledby={modalHeadingId}
        onCancel={(e) => {
          e.preventDefault();
          setSelectedItemForModal(null);
        }}
        onClose={() => {
          if (selectedItemForModal) setSelectedItemForModal(null);
        }}
        onClick={(e) => {
          if (e.target === modalRef.current) setSelectedItemForModal(null);
        }}
        {...({ closedby: 'any' } as any)}
      >
        {selectedItemForModal && (
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-xs font-mono text-slate-500">{selectedItemForModal.qrCode}</div>
                <h2 id={modalHeadingId} className="font-medium text-slate-900 text-base">{selectedItemForModal.name}</h2>
              </div>
              <button
                type="button"
                aria-label="Close item details"
                onClick={() => setSelectedItemForModal(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {selectedItemForModal.photos?.slice(0, 4).map((p: any, idx: number) => (
                <div key={idx} className="h-28 rounded bg-slate-100 overflow-hidden">
                  <img
                    src={p.url}
                    alt={p.caption || `${selectedItemForModal.name} photo ${idx + 1}`}
                    width={400}
                    height={224}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-500 text-[11px] block">Location</span>
                <span className="font-mono text-slate-800 font-medium">{selectedItemForModal.binCode || 'In intake'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Stored since</span>
                <span className="text-slate-800 font-medium">{formatDate(selectedItemForModal.storedAt || new Date().toISOString())}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Monthly storage</span>
                <span className="font-mono text-slate-800 font-medium tabular-nums">{formatInr(selectedItemForModal.monthlyStorageFeeInr)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Declared value</span>
                <span className="font-mono text-slate-800 font-medium tabular-nums">{formatInr(selectedItemForModal.declaredValueInr)}</span>
              </div>
            </div>

            <div className="flex justify-center py-2">
              <QrCodeDisplay value={selectedItemForModal.qrCode} label={`Vault Tag: ${selectedItemForModal.qrCode}`} size={160} />
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItemForModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
