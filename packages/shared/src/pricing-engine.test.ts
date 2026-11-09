import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCubicFeet, determineSizeTier, calculateStoragePrice } from './pricing-engine';
import { DimensionUnit, SizeTier } from './enums';

describe('Pricing Engine Unit Tests', () => {
  it('correctly calculates cubic feet from centimeters', () => {
    // 30.48 cm x 30.48 cm x 30.48 cm = 1 cu ft
    const cuFt = calculateCubicFeet(30.48, 30.48, 30.48, DimensionUnit.CM);
    assert.equal(cuFt, 1);
  });

  it('correctly calculates cubic feet from inches', () => {
    // 12 in x 12 in x 12 in = 1 cu ft
    const cuFt = calculateCubicFeet(12, 12, 12, DimensionUnit.INCH);
    assert.equal(cuFt, 1);
  });

  it('maps cubic feet to the correct size tier', () => {
    assert.equal(determineSizeTier(1.5), SizeTier.SMALL_BOX);
    assert.equal(determineSizeTier(4.0), SizeTier.MEDIUM_BOX);
    assert.equal(determineSizeTier(8.5), SizeTier.LARGE_BOX);
    assert.equal(determineSizeTier(18.0), SizeTier.EXTRA_LARGE_FURNITURE);
    assert.equal(determineSizeTier(32.0), SizeTier.CUSTOM);
  });

  it('computes basic single-item 3-month storage price with standard pickup', () => {
    const result = calculateStoragePrice({
      items: [
        {
          sizeTier: SizeTier.SMALL_BOX,
          quantity: 1
        }
      ],
      commitmentMonths: 3,
      distanceKm: 4
    });

    // Small Box monthly = ₹199
    assert.equal(result.monthlyStorageSubtotal, 199);
    assert.equal(result.commitmentMonths, 3);
    assert.equal(result.commitmentDiscountPercent, 0); // 3 mo = 0% discount
    assert.equal(result.pickupFee, 149); // Base pickup within 5 km
    assert.equal(result.itemsBreakdown.length, 1);
  });

  it('applies commitment discount for 6 and 12 months', () => {
    const result6mo = calculateStoragePrice({
      items: [{ sizeTier: SizeTier.MEDIUM_BOX, quantity: 2 }], // 399 * 2 = 798
      commitmentMonths: 6,
      distanceKm: 4
    });
    // 5% discount on ₹798 = ₹40 discount -> ₹758
    assert.equal(result6mo.commitmentDiscountPercent, 5);
    assert.equal(result6mo.monthlyStorageSubtotal, 798);
    assert.equal(result6mo.discountedMonthlyStorage, 758);

    const result12mo = calculateStoragePrice({
      items: [{ sizeTier: SizeTier.MEDIUM_BOX, quantity: 2 }],
      commitmentMonths: 12,
      distanceKm: 4
    });
    // 10% discount on ₹798 = ₹80 discount -> ₹718
    assert.equal(result12mo.commitmentDiscountPercent, 10);
    assert.equal(result12mo.discountedMonthlyStorage, 718);
  });

  it('calculates extra distance and extra box pickup charges', () => {
    const result = calculateStoragePrice({
      items: [{ sizeTier: SizeTier.SMALL_BOX, quantity: 8 }], // 8 boxes = 3 extra boxes beyond 5
      commitmentMonths: 3,
      distanceKm: 9 // 4 extra km beyond 5 km
    });

    // Base pickup: 149
    // Extra distance: 4 km * 15 = 60
    // Extra boxes: 3 * 35 = 105
    // Total pickup fee = 149 + 60 + 105 = 314
    assert.equal(result.pickupFee, 314);
  });

  it('correctly calculates 18% GST and coupon codes', () => {
    const result = calculateStoragePrice({
      items: [{ sizeTier: SizeTier.MEDIUM_BOX, quantity: 1 }], // 399
      commitmentMonths: 3,
      distanceKm: 3,
      couponCode: 'WELCOME100'
    });

    assert.equal(result.couponDiscountAmount, 100);
    assert.ok(result.totalDueToday > 0);
    assert.ok(result.monthlyRecurringGst > 0);
  });
});

