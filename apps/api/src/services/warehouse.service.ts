import { mockDb } from '@lootupspace/database';
import {
  PhotoType,
  SizeTier,
  StorageItemStatus,
  ZoneType
} from '@lootupspace/shared';
import { NotificationService } from './notifications.service';
import { QrService } from './qr.service';

export class WarehouseService {
  static async scanItemQr(qrCode: string): Promise<any> {
    const item = mockDb.storageItems.find(i => i.qrCode === qrCode || i.id === qrCode);
    if (!item) {
      throw new Error(`No storage item found with QR code: ${qrCode}`);
    }

    // Auto-suggest best bin
    const suggestedBin = this.suggestBestBin(item);

    return {
      item,
      suggestedBin,
      availableBins: mockDb.bins
    };
  }

  static suggestBestBin(item: any): any {
    let preferredZoneType = ZoneType.STANDARD;

    if (item.declaredValueInr >= 50000 || item.category === 'FRAGILE_ART') {
      preferredZoneType = ZoneType.HIGH_VALUE_VAULT;
    } else if (item.category === 'FURNITURE' || item.sizeTier === SizeTier.EXTRA_LARGE_FURNITURE) {
      preferredZoneType = ZoneType.BULKY_FURNITURE;
    } else if (item.category === 'DOCUMENTS' || item.category === 'BOOKS' || item.category === 'ELECTRONICS') {
      preferredZoneType = ZoneType.CLIMATE_CONTROLLED;
    }

    const matchingBin = mockDb.bins.find(
      b => b.zoneType === preferredZoneType && b.usedCubicFeet + item.cubicFeet <= b.maxCubicFeet
    ) || mockDb.bins[0];

    return matchingBin;
  }

  static async completeItemIntake(
    itemId: string,
    verifiedTier: SizeTier,
    binCode: string,
    inspectionNotes?: string,
    intakePhotoUrl?: string
  ): Promise<any> {
    const item = mockDb.storageItems.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');

    const bin = mockDb.bins.find(b => b.code === binCode) || {
      id: `bin_${binCode.toLowerCase()}`,
      code: binCode,
      zoneName: 'Assigned Zone',
      zoneType: ZoneType.STANDARD,
      maxCubicFeet: 25.0,
      usedCubicFeet: 5.0
    };

    item.sizeTier = verifiedTier;
    item.binId = bin.id;
    item.binCode = bin.code;
    item.status = StorageItemStatus.STORED;
    item.storedAt = new Date().toISOString();
    item.notes = inspectionNotes ? `${item.notes || ''} [Warehouse]: ${inspectionNotes}` : item.notes;

    if (intakePhotoUrl) {
      item.photos.push({
        id: `photo_intake_${Date.now()}`,
        itemId: item.id,
        url: intakePhotoUrl,
        type: PhotoType.WAREHOUSE_INSPECTION,
        caption: `Intake inspection at ${bin.code}`,
        takenAt: new Date().toISOString()
      });
    }

    item.updatedAt = new Date().toISOString();

    // Check if all items in related pickup are stored
    const pickup = mockDb.pickupRequests.find(p => p.items.some((i: any) => i.id === item.id));
    if (pickup) {
      const allStored = pickup.items.every((it: any) => {
        const found = mockDb.storageItems.find(dbIt => dbIt.id === it.id);
        return found?.status === StorageItemStatus.STORED;
      });

      if (allStored) {
        pickup.status = 'RECEIVED_AT_WAREHOUSE' as any;
        await NotificationService.sendNotification({
          toPhone: pickup.customerPhone,
          templateKey: 'ITEMS_STORED',
          variables: {
            bookingNumber: pickup.bookingNumber
          }
        });
      }
    }

    return { success: true, item, bin };
  }

  static async getWarehouseInventoryMap(): Promise<any> {
    const warehouse = mockDb.warehouses[0];
    const bins = mockDb.bins.map(bin => {
      const itemsInBin = mockDb.storageItems.filter(i => i.binCode === bin.code && i.status === StorageItemStatus.STORED);
      const usedCuFt = itemsInBin.reduce((sum, it) => sum + (it.cubicFeet || 1.5), 0);
      const percent = Math.min(100, Math.round((usedCuFt / bin.maxCubicFeet) * 100));
      return {
        ...bin,
        usedCubicFeet: usedCuFt,
        occupiedPercent: percent,
        itemsCount: itemsInBin.length,
        items: itemsInBin.map(i => ({ id: i.id, name: i.name, qrCode: i.qrCode, tier: i.sizeTier }))
      };
    });

    const totalCubicFeet = warehouse.totalCubicFeet;
    const totalUsed = bins.reduce((acc, b) => acc + b.usedCubicFeet, 0);

    return {
      warehouse,
      totalCubicFeet,
      usedCubicFeet: totalUsed,
      overallUtilizationPercent: Math.round((totalUsed / totalCubicFeet) * 100),
      zones: mockDb.zones,
      bins
    };
  }

  static async getOutboundPickList(): Promise<any[]> {
    const pendingReturns = mockDb.returnRequests.filter(
      r => r.status === 'REQUESTED' || r.status === 'ITEMS_RETRIEVED'
    );

    return pendingReturns.map(r => ({
      returnRequestId: r.id,
      returnNumber: r.returnNumber,
      customerName: r.customerName,
      deliverySlot: `${r.slotDate} (${r.slotTime})`,
      status: r.status,
      itemsToPick: r.items.map((it: any) => ({
        itemId: it.id,
        name: it.name,
        category: it.category,
        qrCode: it.qrCode,
        binLocation: it.binCode || 'Unassigned',
        sizeTier: it.sizeTier
      }))
    }));
  }

  static async generatePrintableLabels(itemIds?: string[]): Promise<any[]> {
    const items = itemIds && itemIds.length > 0
      ? mockDb.storageItems.filter(i => itemIds.includes(i.id))
      : mockDb.storageItems.slice(0, 8);

    const labelsWithQr = await Promise.all(
      items.map(async item => {
        const qrDataUrl = await QrService.generateQrDataUrl(item.qrCode);
        return {
          itemId: item.id,
          name: item.name,
          category: item.category,
          sizeTier: item.sizeTier,
          qrCode: item.qrCode,
          binCode: item.binCode || 'ZONE-INBOUND',
          customerName: mockDb.users.find(u => u.id === item.userId)?.name || 'Lootup Member',
          qrDataUrl
        };
      })
    );

    return labelsWithQr;
  }
}

