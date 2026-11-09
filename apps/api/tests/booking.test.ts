import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ItemsService } from '../src/services/items.service';
import { PickupsService } from '../src/services/pickups.service';
import { DriverService } from '../src/services/driver.service';
import { WarehouseService } from '../src/services/warehouse.service';
import { ItemCategory, PickupStatus, SizeTier, StorageItemStatus, DEMO_USERS } from '@lootupspace/shared';

describe('End-to-End Booking & Storage Flow Tests', () => {
  const testUserId = DEMO_USERS.CUSTOMER.id;
  let createdItemId: string;
  let createdPickupId: string;
  let generatedOtp: string;

  it('Customer adds an item to their storage cart', async () => {
    const item = await ItemsService.createItem(testUserId, {
      name: 'Sony Bravia 55-inch OLED TV',
      category: ItemCategory.APPLIANCES,
      length: 125,
      width: 25,
      height: 75,
      declaredValueInr: 65000,
      isFragile: true,
      packingRequired: true,
      photos: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600']
    });

    assert.ok(item.id);
    assert.ok(item.qrCode);
    assert.equal(item.status, StorageItemStatus.DRAFT);
    createdItemId = item.id;
  });

  it('Customer schedules pickup with 3-month commitment', async () => {
    const pickup = await PickupsService.schedulePickup(testUserId, {
      itemIds: [createdItemId],
      slotDate: '2026-11-15',
      slotStartTime: '10:00 AM',
      slotEndTime: '12:00 PM',
      commitmentMonths: 3,
      priorityPickup: false
    });

    assert.ok(pickup.id);
    assert.ok(pickup.bookingNumber);
    assert.ok(pickup.pickupOtp);
    assert.equal(pickup.status, PickupStatus.BOOKED);
    createdPickupId = pickup.id;
    generatedOtp = pickup.pickupOtp;
  });

  it('Driver arrives, verifies items with customer OTP and marks picked up', async () => {
    const verification = await DriverService.verifyPickupHandover(
      createdPickupId,
      generatedOtp,
      [createdItemId],
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600'
    );

    assert.equal(verification.success, true);
    assert.equal(verification.pickup.status, PickupStatus.PICKED_UP);

    const item = await ItemsService.getItemById(createdItemId);
    assert.equal(item.status, StorageItemStatus.IN_TRANSIT_TO_WAREHOUSE);
  });

  it('Warehouse scans QR, inspects condition, and assigns shelf bin', async () => {
    const intake = await WarehouseService.completeItemIntake(
      createdItemId,
      SizeTier.LARGE_BOX,
      'A-02-R1-B3',
      'Verified in sealed wooden pallet case'
    );

    assert.equal(intake.success, true);
    assert.equal(intake.item.status, StorageItemStatus.STORED);
    assert.equal(intake.item.binCode, 'A-02-R1-B3');
  });
});
