import { mockDb } from '@lootupspace/database';
import {
  PickupStatus,
  StorageItemStatus,
  calculateStoragePrice,
  DEMO_USERS
} from '@lootupspace/shared';
import { NotificationService } from './notifications.service';

export class PickupsService {
  static async schedulePickup(userId: string, input: any): Promise<any> {
    const user = mockDb.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    // 1. Resolve address
    let address = mockDb.addresses.find(a => a.id === input.addressId && a.userId === userId);
    if (!address && input.newAddress) {
      address = {
        id: `addr_${Date.now()}`,
        userId,
        ...input.newAddress,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDb.addresses.push(address);
    }
    if (!address) {
      address = mockDb.addresses.find(a => a.userId === userId) || {
        id: 'addr_fallback',
        userId,
        label: 'Home',
        line1: '12th Main Road, HAL 2nd Stage, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        lat: 12.9784,
        lng: 77.6408,
        isDefault: true
      };
    }

    // 2. Resolve items
    const selectedItems = mockDb.storageItems.filter(
      item => input.itemIds.includes(item.id) && item.userId === userId
    );
    if (selectedItems.length === 0) {
      throw new Error('No valid items found for pickup');
    }

    // 3. Calculate price
    const priceCalculation = calculateStoragePrice({
      items: selectedItems.map(i => ({
        sizeTier: i.sizeTier,
        length: i.length,
        width: i.width,
        height: i.height,
        unit: i.unit,
        quantity: i.quantity,
        packingRequired: i.packingRequired,
        materialsRequired: input.packingMaterials
      })),
      commitmentMonths: input.commitmentMonths || 3,
      priorityPickup: input.priorityPickup,
      insuranceTierId: input.insuranceTierId || 'BASIC',
      couponCode: input.couponCode
    });

    const bookingId = `pickup_${Date.now()}`;
    const bookingNumber = `LUP-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Auto-assign default driver
    const driverProfile = mockDb.drivers[0];
    const driverUser = mockDb.users.find(u => u.id === driverProfile?.userId);

    const newPickup = {
      id: bookingId,
      bookingNumber,
      userId,
      customerName: user.name || 'Valued Customer',
      customerPhone: user.phone,
      address,
      slotDate: input.slotDate,
      slotStartTime: input.slotStartTime || '10:00 AM',
      slotEndTime: input.slotEndTime || '12:00 PM',
      status: PickupStatus.BOOKED,
      driverId: driverProfile?.id || null,
      driverName: driverUser?.name || 'Assigned Driver',
      driverPhone: driverUser?.phone || '+919876543211',
      driverVehicleNumber: driverProfile?.vehicleNumber || 'KA-01-EJ-4912',
      driverVehicleType: driverProfile?.vehicleType || 'MINI_TRUCK_TATA_ACE',
      driverCurrentLat: 12.9782,
      driverCurrentLng: 77.6408,
      pickupOtp,
      notes: input.notes || null,
      totalAmount: priceCalculation.totalDueToday,
      monthlyStorage: priceCalculation.monthlyRecurringTotal,
      pickupFee: priceCalculation.pickupFee,
      commitmentMonths: input.commitmentMonths || 3,
      items: selectedItems,
      pricingBreakdown: priceCalculation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Mark items as scheduled
    selectedItems.forEach(item => {
      item.status = StorageItemStatus.SCHEDULED_FOR_PICKUP;
      item.updatedAt = new Date().toISOString();
    });

    mockDb.pickupRequests.unshift(newPickup);

    // Send instant WhatsApp/SMS notification
    await NotificationService.sendNotification({
      toPhone: user.phone,
      toEmail: user.email || undefined,
      templateKey: 'BOOKING_CONFIRMED',
      variables: {
        bookingNumber,
        slotDate: input.slotDate,
        slotTime: `${input.slotStartTime || '10:00 AM'} - ${input.slotEndTime || '12:00 PM'}`,
        address: `${address.line1}, ${address.city} - ${address.pincode}`
      }
    });

    return newPickup;
  }

  static async getPickupById(id: string): Promise<any> {
    const pickup = mockDb.pickupRequests.find(p => p.id === id || p.bookingNumber === id);
    if (!pickup) throw new Error('Pickup booking not found');
    return pickup;
  }

  static async getUserPickups(userId: string): Promise<any[]> {
    return mockDb.pickupRequests.filter(p => p.userId === userId);
  }

  static async updatePickupStatus(pickupId: string, newStatus: PickupStatus, extraData?: any): Promise<any> {
    const pickup = mockDb.pickupRequests.find(p => p.id === pickupId);
    if (!pickup) throw new Error('Pickup request not found');

    pickup.status = newStatus;
    if (extraData) {
      Object.assign(pickup, extraData);
    }
    pickup.updatedAt = new Date().toISOString();

    // Trigger lifecycle events
    if (newStatus === PickupStatus.DRIVER_ON_THE_WAY) {
      await NotificationService.sendNotification({
        toPhone: pickup.customerPhone,
        templateKey: 'DRIVER_ON_THE_WAY',
        variables: {
          driverName: pickup.driverName,
          etaMinutes: 15,
          pickupOtp: pickup.pickupOtp
        }
      });
    } else if (newStatus === PickupStatus.PICKED_UP) {
      pickup.items.forEach((item: any) => {
        const dbItem = mockDb.storageItems.find(i => i.id === item.id);
        if (dbItem) dbItem.status = StorageItemStatus.IN_TRANSIT_TO_WAREHOUSE;
      });

      await NotificationService.sendNotification({
        toPhone: pickup.customerPhone,
        templateKey: 'PICKUP_COMPLETED',
        variables: {
          bookingNumber: pickup.bookingNumber,
          itemCount: pickup.items.length
        }
      });
    }

    return pickup;
  }
}

