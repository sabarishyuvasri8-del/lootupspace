import { DEFAULT_PRICING_TIERS, PRICING_CONFIG } from './constants';
import { DimensionUnit, SizeTier } from './enums';
import { PriceCalculationInput, PriceCalculationResult, PriceBreakdownItem } from './types';

/**
 * Calculates cubic feet from dimensions in CM, INCH, or FT.
 */
export function calculateCubicFeet(
  length: number,
  width: number,
  height: number,
  unit: DimensionUnit = DimensionUnit.CM
): number {
  if (!length || !width || !height || length <= 0 || width <= 0 || height <= 0) {
    return 0;
  }

  let lFt = length;
  let wFt = width;
  let hFt = height;

  if (unit === DimensionUnit.CM) {
    lFt = length / 30.48;
    wFt = width / 30.48;
    hFt = height / 30.48;
  } else if (unit === DimensionUnit.INCH) {
    lFt = length / 12.0;
    wFt = width / 12.0;
    hFt = height / 12.0;
  }

  const cuFt = lFt * wFt * hFt;
  return Math.round(cuFt * 100) / 100;
}

/**
 * Maps calculated cubic feet to the optimal size tier.
 */
export function determineSizeTier(cubicFeet: number): SizeTier {
  if (cubicFeet <= 2.0) {
    return SizeTier.SMALL_BOX;
  } else if (cubicFeet <= 5.0) {
    return SizeTier.MEDIUM_BOX;
  } else if (cubicFeet <= 10.0) {
    return SizeTier.LARGE_BOX;
  } else if (cubicFeet <= 25.0) {
    return SizeTier.EXTRA_LARGE_FURNITURE;
  } else {
    return SizeTier.CUSTOM;
  }
}

/**
 * Computes monthly storage price for an item based on size tier or custom cubic feet.
 */
export function calculateItemMonthlyPrice(tier: SizeTier, cubicFeet: number): number {
  if (tier === SizeTier.CUSTOM) {
    const ratePerCuFt = DEFAULT_PRICING_TIERS[SizeTier.CUSTOM].monthlyRateInr;
    return Math.max(PRICING_CONFIG.MINIMUM_MONTHLY_CHARGE, Math.round(cubicFeet * ratePerCuFt));
  }
  return DEFAULT_PRICING_TIERS[tier].monthlyRateInr;
}

/**
 * Core Pricing Engine for Lootupspace.
 * Calculates monthly storage, discounts, pickup/return trips, addons, coupons, and 18% GST.
 */
export function calculateStoragePrice(input: PriceCalculationInput): PriceCalculationResult {
  const itemsBreakdown: PriceBreakdownItem[] = [];
  let totalMonthlyStorage = 0;
  let totalBoxesCount = 0;
  let packingServiceFee = 0;
  let packingMaterialsFee = 0;

  for (const item of input.items) {
    const qty = Math.max(1, item.quantity || 1);
    totalBoxesCount += qty;

    let cuFt = 0;
    let tier: SizeTier;

    if (item.length && item.width && item.height) {
      cuFt = calculateCubicFeet(item.length, item.width, item.height, item.unit || DimensionUnit.CM);
      tier = item.sizeTier || determineSizeTier(cuFt);
    } else if (item.sizeTier) {
      tier = item.sizeTier;
      cuFt = DEFAULT_PRICING_TIERS[tier].maxCubicFeet;
    } else {
      tier = SizeTier.MEDIUM_BOX;
      cuFt = 5.0;
    }

    const unitPrice = calculateItemMonthlyPrice(tier, cuFt);
    const itemTotal = unitPrice * qty;
    totalMonthlyStorage += itemTotal;

    if (item.packingRequired) {
      packingServiceFee += PRICING_CONFIG.ADDONS.PROFESSIONAL_PACKING_PER_ITEM * qty;
    }
    if (item.materialsRequired) {
      packingMaterialsFee += PRICING_CONFIG.ADDONS.PACKING_MATERIALS_PER_ITEM * qty;
    }

    itemsBreakdown.push({
      name: DEFAULT_PRICING_TIERS[tier].name,
      description: DEFAULT_PRICING_TIERS[tier].description,
      quantity: qty,
      unitMonthlyPrice: unitPrice,
      totalMonthlyPrice: itemTotal,
      sizeTier: tier,
      cubicFeet: cuFt
    });
  }

  // Ensure minimum monthly storage charge
  if (totalMonthlyStorage > 0 && totalMonthlyStorage < PRICING_CONFIG.MINIMUM_MONTHLY_CHARGE) {
    totalMonthlyStorage = PRICING_CONFIG.MINIMUM_MONTHLY_CHARGE;
  }

  // Commitment Discount (3mo: 0%, 6mo: 5%, 12mo: 10%)
  const commitmentMonths = input.commitmentMonths || 3;
  const discountRate = PRICING_CONFIG.COMMITMENT_DISCOUNTS[commitmentMonths] ?? 0;
  const commitmentDiscountAmount = Math.round(totalMonthlyStorage * discountRate);
  const discountedMonthlyStorage = totalMonthlyStorage - commitmentDiscountAmount;
  const totalStorageForCommitment = discountedMonthlyStorage * commitmentMonths;

  // Pickup Fee Calculation
  let pickupFee = PRICING_CONFIG.BASE_PICKUP_FEE;
  const distanceKm = input.distanceKm ?? 4.0;
  if (distanceKm > PRICING_CONFIG.BASE_FREE_KM) {
    const extraKm = distanceKm - PRICING_CONFIG.BASE_FREE_KM;
    pickupFee += Math.round(extraKm * PRICING_CONFIG.PER_KM_FEE_BEYOND_BASE);
  }
  if (totalBoxesCount > PRICING_CONFIG.BASE_FREE_BOXES) {
    const extraBoxes = totalBoxesCount - PRICING_CONFIG.BASE_FREE_BOXES;
    pickupFee += extraBoxes * PRICING_CONFIG.PER_EXTRA_BOX_FEE;
  }

  // Optional Addons
  const priorityPickupFee = input.priorityPickup ? PRICING_CONFIG.ADDONS.PRIORITY_PICKUP : 0;
  const cleaningFee = input.cleaningService ? PRICING_CONFIG.ADDONS.CLEANING_BEFORE_RETURN : 0;

  // Insurance Fee
  let insuranceMonthlyFee = 0;
  if (input.insuranceTierId) {
    const selectedInsurance = PRICING_CONFIG.INSURANCE_TIERS.find(t => t.tierId === input.insuranceTierId);
    if (selectedInsurance) {
      insuranceMonthlyFee = selectedInsurance.monthlyPrice;
    }
  }

  // Coupon Discount
  let couponDiscountAmount = 0;
  if (input.couponCode) {
    const normalizedCoupon = input.couponCode.trim().toUpperCase();
    if (normalizedCoupon === 'LOOTUP50') {
      couponDiscountAmount = 50;
    } else if (normalizedCoupon === 'WELCOME100') {
      couponDiscountAmount = 100;
    } else if (normalizedCoupon === 'FREESHIP') {
      couponDiscountAmount = pickupFee;
    }
  }

  // Subtotals
  const oneTimeChargesSubtotal = Math.max(0, pickupFee + packingServiceFee + packingMaterialsFee + priorityPickupFee + cleaningFee - couponDiscountAmount);
  const monthlyRecurringSubtotal = discountedMonthlyStorage + insuranceMonthlyFee;

  // GST (18%)
  const oneTimeGst = Math.round(oneTimeChargesSubtotal * (PRICING_CONFIG.GST_RATE_PERCENT / 100));
  const monthlyRecurringGst = Math.round(monthlyRecurringSubtotal * (PRICING_CONFIG.GST_RATE_PERCENT / 100));

  // Today's Payment: First month's storage + one time fees + taxes
  const firstMonthTotal = monthlyRecurringSubtotal + monthlyRecurringGst;
  const oneTimeTotalWithTax = oneTimeChargesSubtotal + oneTimeGst;
  const totalDueToday = firstMonthTotal + oneTimeTotalWithTax;
  const monthlyRecurringTotal = firstMonthTotal;

  return {
    monthlyStorageSubtotal: totalMonthlyStorage,
    commitmentMonths,
    commitmentDiscountPercent: discountRate * 100,
    commitmentDiscountAmount,
    discountedMonthlyStorage,
    totalStorageForCommitment,
    pickupFee,
    packingServiceFee,
    packingMaterialsFee,
    priorityPickupFee,
    insuranceMonthlyFee,
    cleaningFee,
    couponDiscountAmount,
    oneTimeChargesSubtotal,
    monthlyRecurringSubtotal,
    oneTimeGst,
    monthlyRecurringGst,
    totalDueToday,
    monthlyRecurringTotal,
    itemsBreakdown
  };
}

