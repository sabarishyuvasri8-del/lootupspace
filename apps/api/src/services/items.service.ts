import { mockDb } from '@lootupspace/database';
import {
  AddItemInput,
  DimensionUnit,
  PhotoType,
  SizeTier,
  StorageItemStatus,
  calculateCubicFeet,
  determineSizeTier,
  calculateItemMonthlyPrice
} from '@lootupspace/shared';
import { QrService } from './qr.service';

export class ItemsService {
  static async createItem(userId: string, input: AddItemInput): Promise<any> {
    const l = input.length || 40;
    const w = input.width || 30;
    const h = input.height || 30;
    const unit = input.unit || DimensionUnit.CM;
    const cuFt = calculateCubicFeet(l, w, h, unit);
    const tier = input.sizeTier || determineSizeTier(cuFt);
    const monthlyFee = calculateItemMonthlyPrice(tier, cuFt);

    const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const qrCode = `LUP-ITM-${Math.floor(100000 + Math.random() * 900000)}`;

    const photos = (input.photos || []).map((url, index) => ({
      id: `photo_${Date.now()}_${index}`,
      itemId,
      url,
      type: PhotoType.CUSTOMER,
      caption: index === 0 ? 'Primary front angle' : `Detail angle ${index + 1}`,
      takenAt: new Date().toISOString()
    }));

    const newItem = {
      id: itemId,
      userId,
      name: input.name,
      category: input.category,
      description: input.description || null,
      length: l,
      width: w,
      height: h,
      unit,
      weightKg: input.weightKg || 5.0,
      quantity: input.quantity || 1,
      declaredValueInr: input.declaredValueInr || 2000,
      isFragile: Boolean(input.isFragile),
      needsSpecialHandling: Boolean(input.needsSpecialHandling),
      packingRequired: Boolean(input.packingRequired),
      notes: input.notes || null,
      sizeTier: tier,
      cubicFeet: cuFt,
      monthlyStorageFeeInr: monthlyFee,
      qrCode,
      status: StorageItemStatus.DRAFT,
      binId: null,
      binCode: null,
      photos,
      storedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockDb.storageItems.unshift(newItem);
    return newItem;
  }

  static async getUserItems(userId: string, query?: { category?: string; status?: string; search?: string }): Promise<any[]> {
    let items = mockDb.storageItems.filter(item => item.userId === userId);

    if (query?.category) {
      items = items.filter(item => item.category === query.category);
    }

    if (query?.status) {
      items = items.filter(item => item.status === query.status);
    }

    if (query?.search) {
      const s = query.search.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().includes(s) || (item.description && item.description.toLowerCase().includes(s)));
    }

    return items;
  }

  static async getItemById(itemId: string): Promise<any> {
    const item = mockDb.storageItems.find(i => i.id === itemId);
    if (!item) throw new Error('Storage item not found');
    return item;
  }

  static async getItemQrData(itemId: string): Promise<{ qrCode: string; dataUrl: string }> {
    const item = await this.getItemById(itemId);
    const dataUrl = await QrService.generateQrDataUrl(item.qrCode);
    return {
      qrCode: item.qrCode,
      dataUrl
    };
  }

  static async updateItem(itemId: string, userId: string, updateData: Partial<any>): Promise<any> {
    const item = mockDb.storageItems.find(i => i.id === itemId && i.userId === userId);
    if (!item) throw new Error('Storage item not found or unauthorized');

    Object.assign(item, updateData, { updatedAt: new Date().toISOString() });
    return item;
  }

  static async deleteDraftItem(itemId: string, userId: string): Promise<{ success: boolean }> {
    const index = mockDb.storageItems.findIndex(i => i.id === itemId && i.userId === userId);
    if (index === -1) throw new Error('Item not found');

    const item = mockDb.storageItems[index];
    if (item.status !== StorageItemStatus.DRAFT) {
      throw new Error('Only draft items can be deleted. Stored items must be returned first.');
    }

    mockDb.storageItems.splice(index, 1);
    return { success: true };
  }
}

