import { SizeTier, ZoneType } from './enums';

export const SERVICEABLE_CITIES = [
  {
    code: 'BLR',
    name: 'Bengaluru',
    state: 'Karnataka',
    active: true,
    hubs: ['Indiranagar Hub', 'Whitefield Hub', 'Koramangala Hub'],
    pincodes: ['560001', '560008', '560025', '560034', '560038', '560066', '560076', '560100', '560102', '560103']
  },
  {
    code: 'BOM',
    name: 'Mumbai',
    state: 'Maharashtra',
    active: true,
    hubs: ['Bandra-Kurla Hub', 'Andheri East Hub', 'Powai Central Hub'],
    pincodes: ['400001', '400050', '400051', '400053', '400069', '400072', '400076', '400093', '400098', '400101']
  },
  {
    code: 'MAA',
    name: 'Chennai',
    state: 'Tamil Nadu',
    active: true,
    hubs: ['OMR Tech Hub', 'Anna Nagar Hub', 'T-Nagar Central Hub'],
    pincodes: ['600001', '600017', '600028', '600040', '600041', '600096', '600097', '600113', '600119', '600122']
  }
];

export const DEFAULT_PRICING_TIERS = {
  [SizeTier.SMALL_BOX]: {
    name: 'Small Box',
    description: 'Books, documents, shoes, winter wear, small gadgets',
    maxCubicFeet: 2.0,
    monthlyRateInr: 199,
    dimensionsGuide: '1.5 ft × 1.2 ft × 1.1 ft'
  },
  [SizeTier.MEDIUM_BOX]: {
    name: 'Medium Box',
    description: 'Wardrobe clothes, kitchen appliances, toys, sports gear',
    maxCubicFeet: 5.0,
    monthlyRateInr: 399,
    dimensionsGuide: '2.0 ft × 1.5 ft × 1.6 ft'
  },
  [SizeTier.LARGE_BOX]: {
    name: 'Large Box',
    description: 'Bedding, heavy electronics, musical instruments, monitors',
    maxCubicFeet: 10.0,
    monthlyRateInr: 699,
    dimensionsGuide: '2.5 ft × 2.0 ft × 2.0 ft'
  },
  [SizeTier.EXTRA_LARGE_FURNITURE]: {
    name: 'Extra Large / Furniture',
    description: 'Bicycles, study tables, chairs, mattresses, large TVs',
    maxCubicFeet: 25.0,
    monthlyRateInr: 1499,
    dimensionsGuide: 'Up to 25 cubic feet'
  },
  [SizeTier.CUSTOM]: {
    name: 'Custom Storage',
    description: 'Calculated dynamically per cubic foot for unique bulk items',
    maxCubicFeet: 999.0,
    monthlyRateInr: 75, // Per cubic foot
    dimensionsGuide: '₹75 per cubic foot / month'
  }
};

export const PRICING_CONFIG = {
  MINIMUM_MONTHLY_CHARGE: 199,
  BASE_PICKUP_FEE: 149,
  BASE_FREE_KM: 5,
  PER_KM_FEE_BEYOND_BASE: 15,
  BASE_FREE_BOXES: 5,
  PER_EXTRA_BOX_FEE: 35,
  GST_RATE_PERCENT: 18,
  EARLY_EXIT_FEE_MONTHS: 1, // 1 month storage penalty
  LATE_PAYMENT_INTEREST_RATE_MONTHLY: 0.02, // 2%
  GRACE_PERIOD_DAYS: 7,
  COMMITMENT_DISCOUNTS: {
    3: 0.0, // 3 months: 0%
    6: 0.05, // 6 months: 5% off
    12: 0.10 // 12 months: 10% off
  },
  ADDONS: {
    PROFESSIONAL_PACKING_PER_ITEM: 249,
    PACKING_MATERIALS_PER_ITEM: 99,
    PRIORITY_PICKUP: 199,
    CLEANING_BEFORE_RETURN: 299
  },
  INSURANCE_TIERS: [
    {
      tierId: 'BASIC',
      name: 'Complimentary Basic Shield',
      coverageAmount: 10000,
      monthlyPrice: 0,
      description: 'Included with every booking up to ₹10,000 declared value'
    },
    {
      tierId: 'SILVER',
      name: 'Silver Security Cover',
      coverageAmount: 25000,
      monthlyPrice: 99,
      description: 'Covers items up to ₹25,000'
    },
    {
      tierId: 'GOLD',
      name: 'Gold Protection Cover',
      coverageAmount: 50000,
      monthlyPrice: 199,
      description: 'Covers items up to ₹50,000'
    },
    {
      tierId: 'PLATINUM',
      name: 'Platinum Vault Shield',
      coverageAmount: 100000,
      monthlyPrice: 349,
      description: 'Covers items up to ₹1,00,000 with dedicated vault security'
    }
  ]
};

export const RESTRICTED_PROHIBITED_ITEMS = [
  {
    title: 'Perishable Food & Liquids',
    reason: 'Attracts pests, spoils easily, and creates odour or leak hazards.',
    examples: 'Raw foods, dairy, fresh fruits, unsealed liquids, opened beverages'
  },
  {
    title: 'Hazardous, Flammable & Chemical Goods',
    reason: 'Strict fire safety compliance under warehouse safety regulations.',
    examples: 'Gas cylinders, petrol/diesel, fireworks, paints, strong acids, thinner'
  },
  {
    title: 'Weapons, Explosives & Firearms',
    reason: 'Strictly prohibited by Indian law and public safety regulations.',
    examples: 'Guns, ammunition, unlicensed airguns, switchblades, military gear'
  },
  {
    title: 'Live Animals, Insects & Plants',
    reason: 'Living organisms cannot survive in sealed storage facilities.',
    examples: 'Pets, bonsai, potted plants, insects, biological cultures'
  },
  {
    title: 'Narcotics, Contraband & Illegal Substances',
    reason: 'Violates NDPS Act and Indian penal laws.',
    examples: 'Illicit drugs, psychotropics, contraband goods, smuggled merchandise'
  },
  {
    title: 'Loose High-Value Cash & Bullion',
    reason: 'Cash & loose bullion exceeding ₹50,000 must be deposited in bank lockers.',
    examples: 'Bundles of currency, loose gold coins/bars, bearer bonds'
  },
  {
    title: 'Stolen or Disputed Property',
    reason: 'Items subject to ongoing court litigation or unclear ownership.',
    examples: 'Stolen electronic equipment, disputed ancestral artefacts'
  }
];

export const DEMO_USERS = {
  CUSTOMER: {
    id: 'user_cust_001',
    phone: '+919876543210',
    email: 'customer@lootup.space',
    name: 'Aarav Sharma',
    role: 'CUSTOMER'
  },
  DRIVER: {
    id: 'user_drv_001',
    phone: '+919876543211',
    email: 'driver@lootup.space',
    name: 'Ramesh Kumar (Pickup Lead)',
    role: 'DRIVER'
  },
  WAREHOUSE: {
    id: 'user_wh_001',
    phone: '+919876543212',
    email: 'warehouse@lootup.space',
    name: 'Priya Sundaram (Inventory Officer)',
    role: 'WAREHOUSE'
  },
  ADMIN: {
    id: 'user_adm_001',
    phone: '+919876543213',
    email: 'admin@lootup.space',
    name: 'Siddharth Iyer (Operations VP)',
    role: 'ADMIN'
  }
};

