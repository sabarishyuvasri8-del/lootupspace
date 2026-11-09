import { mockDb } from '@lootupspace/database';
import { PickupStatus, ReturnStatus, StorageItemStatus } from '@lootupspace/shared';
import { PickupsService } from './pickups.service';
import { ReturnsService } from './returns.service';

export class DriverService {
  static async getDriverJobs(driverUserId: string): Promise<{ pickups: any[]; deliveries: any[] }> {
    const driver = mockDb.drivers.find(d => d.userId === driverUserId) || mockDb.drivers[0];

    const pickups = mockDb.pickupRequests.filter(
      p => p.driverId === driver.id || !p.driverId
    );

    const deliveries = mockDb.returnRequests.filter(
      r => r.driverId === driver.id || !r.driverId
    );

    return { pickups, deliveries };
  }

  static async updateDriverLocation(driverUserId: string, lat: number, lng: number): Promise<any> {
    const driver = mockDb.drivers.find(d => d.userId === driverUserId) || mockDb.drivers[0];
    driver.currentLat = lat;
    driver.currentLng = lng;
    driver.updatedAt = new Date().toISOString();

    // Also update any active pickup
    const activePickup = mockDb.pickupRequests.find(
      p => p.driverId === driver.id && (p.status === PickupStatus.DRIVER_ON_THE_WAY || p.status === PickupStatus.ARRIVED_AT_CUSTOMER)
    );
    if (activePickup) {
      activePickup.driverCurrentLat = lat;
      activePickup.driverCurrentLng = lng;
    }

    return { success: true, lat, lng };
  }

  static async verifyPickupHandover(
    pickupRequestId: string,
    customerOtp: string,
    verifiedItemIds: string[],
    proofPhotoUrl?: string,
    signatureUrl?: string,
    itemAdjustments?: Array<{ itemId: string; adjustedTier?: any; adjustedWeightKg?: number; notes?: string }>
  ): Promise<any> {
    const pickup = mockDb.pickupRequests.find(p => p.id === pickupRequestId);
    if (!pickup) throw new Error('Pickup booking not found');

    // Verify OTP (accept entered or demo master '4829' or '1234')
    if (customerOtp !== pickup.pickupOtp && customerOtp !== '4829' && customerOtp !== '1234') {
      throw new Error('Invalid customer handover OTP. Verification failed.');
    }

    // Apply adjustments if any
    if (itemAdjustments && itemAdjustments.length > 0) {
      for (const adj of itemAdjustments) {
        const item = mockDb.storageItems.find(i => i.id === adj.itemId);
        if (item) {
          if (adj.adjustedTier) item.sizeTier = adj.adjustedTier;
          if (adj.adjustedWeightKg) item.weightKg = adj.adjustedWeightKg;
          if (adj.notes) item.notes = `${item.notes || ''} [Driver adjustment]: ${adj.notes}`;
        }
      }
    }

    pickup.status = PickupStatus.PICKED_UP;
    pickup.proofPhotoUrl = proofPhotoUrl || null;
    pickup.signatureUrl = signatureUrl || null;
    pickup.verifiedItemIds = verifiedItemIds;
    pickup.updatedAt = new Date().toISOString();

    // Mark items in transit
    pickup.items.forEach((item: any) => {
      const it = mockDb.storageItems.find(i => i.id === item.id);
      if (it) {
        it.status = StorageItemStatus.IN_TRANSIT_TO_WAREHOUSE;
        it.updatedAt = new Date().toISOString();
      }
    });

    return {
      success: true,
      pickup,
      message: 'Items verified and successfully handed over to Lootup driver.'
    };
  }

  static async verifyDeliveryHandover(
    returnRequestId: string,
    deliveryOtp: string,
    proofPhotoUrl?: string,
    signatureUrl?: string
  ): Promise<any> {
    return ReturnsService.completeDelivery(returnRequestId, deliveryOtp, proofPhotoUrl, signatureUrl);
  }
}

