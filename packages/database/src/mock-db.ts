import {
  DEMO_USERS,
  SERVICEABLE_CITIES,
  DEFAULT_PRICING_TIERS,
  PRICING_CONFIG,
  ItemCategory,
  SizeTier,
  StorageItemStatus,
  PickupStatus,
  ReturnStatus,
  UserRole,
  UserStatus,
  KycStatus,
  DimensionUnit,
  VehicleType,
  ZoneType,
  InvoiceStatus,
  TicketStatus,
  TicketPriority,
  PhotoType
} from '@lootupspace/shared';

// Initialized rich mock data store for immediate out-of-the-box operation and seed replication
export class LootupMockDatabase {
  users: any[] = [];
  addresses: any[] = [];
  cities: any[] = [];
  serviceablePincodes: any[] = [];
  warehouses: any[] = [];
  zones: any[] = [];
  racks: any[] = [];
  bins: any[] = [];
  storageItems: any[] = [];
  itemPhotos: any[] = [];
  pickupRequests: any[] = [];
  returnRequests: any[] = [];
  invoices: any[] = [];
  payments: any[] = [];
  subscriptions: any[] = [];
  drivers: any[] = [];
  tickets: any[] = [];
  ticketMessages: any[] = [];
  notifications: any[] = [];
  auditLogs: any[] = [];
  waitlistLeads: any[] = [];
  pricingTiers: any[] = [];
  coupons: any[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    // 1. Users
    const customer = {
      id: DEMO_USERS.CUSTOMER.id,
      phone: DEMO_USERS.CUSTOMER.phone,
      email: DEMO_USERS.CUSTOMER.email,
      name: DEMO_USERS.CUSTOMER.name,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'AARAV200',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date('2026-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date().toISOString()
    };

    const driverUser = {
      id: DEMO_USERS.DRIVER.id,
      phone: DEMO_USERS.DRIVER.phone,
      email: DEMO_USERS.DRIVER.email,
      name: DEMO_USERS.DRIVER.name,
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'RAMESH100',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date('2026-01-10T09:00:00Z').toISOString(),
      updatedAt: new Date().toISOString()
    };

    const warehouseStaff = {
      id: DEMO_USERS.WAREHOUSE.id,
      phone: DEMO_USERS.WAREHOUSE.phone,
      email: DEMO_USERS.WAREHOUSE.email,
      name: DEMO_USERS.WAREHOUSE.name,
      role: UserRole.WAREHOUSE,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'PRIYA100',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date('2026-01-05T08:00:00Z').toISOString(),
      updatedAt: new Date().toISOString()
    };

    const admin = {
      id: DEMO_USERS.ADMIN.id,
      phone: DEMO_USERS.ADMIN.phone,
      email: DEMO_USERS.ADMIN.email,
      name: DEMO_USERS.ADMIN.name,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'ADMIN001',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date('2025-12-01T08:00:00Z').toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users = [customer, driverUser, warehouseStaff, admin];

    // 2. Driver Profile
    this.drivers = [
      {
        id: 'drv_profile_001',
        userId: driverUser.id,
        vehicleType: VehicleType.MINI_TRUCK_TATA_ACE,
        vehicleNumber: 'KA-01-EJ-4912',
        licenseNumber: 'KA0120190038921',
        isAvailable: true,
        currentLat: 12.9782,
        currentLng: 77.6408,
        totalTripsDone: 142,
        ratingAverage: 4.9,
        createdAt: new Date('2026-01-10T09:00:00Z').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 3. Addresses
    this.addresses = [
      {
        id: 'addr_001',
        userId: customer.id,
        label: 'Home (Indiranagar)',
        line1: '#402, 12th Main Road, HAL 2nd Stage',
        line2: 'Opposite Defence Colony Park',
        landmark: 'Near Toit Brewpub',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        lat: 12.9784,
        lng: 77.6408,
        isDefault: true,
        createdAt: new Date('2026-01-15T10:05:00Z').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'addr_002',
        userId: customer.id,
        label: 'Office (Koramangala)',
        line1: '7th Block, 80 Feet Road, Koramangala',
        line2: 'Building 4B, 3rd Floor',
        landmark: 'Near Sony World Signal',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034',
        lat: 12.9352,
        lng: 77.6245,
        isDefault: false,
        createdAt: new Date('2026-02-01T11:00:00Z').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 4. Cities and Pincodes
    this.cities = SERVICEABLE_CITIES.map((c, idx) => ({
      id: `city_${c.code.toLowerCase()}`,
      code: c.code,
      name: c.name,
      state: c.state,
      isActive: c.active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    this.serviceablePincodes = [];
    SERVICEABLE_CITIES.forEach((city, cIdx) => {
      city.pincodes.forEach((pin, pIdx) => {
        this.serviceablePincodes.push({
          id: `pin_${pin}`,
          cityId: `city_${city.code.toLowerCase()}`,
          pincode: pin,
          hubName: city.hubs[pIdx % city.hubs.length],
          isServiceable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
    });

    // 5. Warehouses, Zones, Bins
    this.warehouses = [
      {
        id: 'wh_blr_01',
        cityId: 'city_blr',
        name: 'Bengaluru Indiranagar Tech Hub',
        code: 'WH-BLR-01',
        address: 'Plot 45, Old Airport Road, Domlur, Bengaluru - 560071',
        totalCubicFeet: 50000.0,
        usedCubicFeet: 18240.0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'wh_bom_01',
        cityId: 'city_bom',
        name: 'Mumbai BKC Central Vault Hub',
        code: 'WH-BOM-01',
        address: 'Warehouse Complex C, Kalina, Santacruz East, Mumbai - 400098',
        totalCubicFeet: 65000.0,
        usedCubicFeet: 27500.0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'wh_maa_01',
        cityId: 'city_maa',
        name: 'Chennai OMR Tech Gateway Hub',
        code: 'WH-MAA-01',
        address: 'Survey 108, Rajiv Gandhi Salai, Sholinganallur, Chennai - 600119',
        totalCubicFeet: 40000.0,
        usedCubicFeet: 12100.0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Seed Bins for Bengaluru
    const zoneLetters = ['A', 'B', 'C', 'D'];
    const zoneTypes = [ZoneType.STANDARD, ZoneType.CLIMATE_CONTROLLED, ZoneType.HIGH_VALUE_VAULT, ZoneType.BULKY_FURNITURE];

    this.zones = zoneLetters.map((letter, idx) => ({
      id: `zone_${letter.toLowerCase()}`,
      warehouseId: 'wh_blr_01',
      code: `ZONE-${letter}`,
      name: `Zone ${letter} (${zoneTypes[idx]})`,
      zoneType: zoneTypes[idx],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    this.bins = [
      {
        id: 'bin_001',
        rackId: 'rack_01',
        code: 'A-01-R1-B1',
        maxCubicFeet: 25.0,
        usedCubicFeet: 12.0,
        isAvailable: true,
        zoneName: 'Zone A (Standard)',
        zoneType: ZoneType.STANDARD,
        warehouseName: 'Bengaluru Indiranagar Tech Hub'
      },
      {
        id: 'bin_002',
        rackId: 'rack_01',
        code: 'A-01-R1-B2',
        maxCubicFeet: 25.0,
        usedCubicFeet: 22.5,
        isAvailable: true,
        zoneName: 'Zone A (Standard)',
        zoneType: ZoneType.STANDARD,
        warehouseName: 'Bengaluru Indiranagar Tech Hub'
      },
      {
        id: 'bin_003',
        rackId: 'rack_02',
        code: 'B-02-R3-B4',
        maxCubicFeet: 20.0,
        usedCubicFeet: 8.0,
        isAvailable: true,
        zoneName: 'Zone B (Climate-Controlled)',
        zoneType: ZoneType.CLIMATE_CONTROLLED,
        warehouseName: 'Bengaluru Indiranagar Tech Hub'
      },
      {
        id: 'bin_004',
        rackId: 'rack_03',
        code: 'C-01-VAULT-01',
        maxCubicFeet: 15.0,
        usedCubicFeet: 4.5,
        isAvailable: true,
        zoneName: 'Zone C (High-Value Vault)',
        zoneType: ZoneType.HIGH_VALUE_VAULT,
        warehouseName: 'Bengaluru Indiranagar Tech Hub'
      },
      {
        id: 'bin_005',
        rackId: 'rack_04',
        code: 'D-01-FURN-09',
        maxCubicFeet: 50.0,
        usedCubicFeet: 35.0,
        isAvailable: true,
        zoneName: 'Zone D (Bulky Furniture)',
        zoneType: ZoneType.BULKY_FURNITURE,
        warehouseName: 'Bengaluru Indiranagar Tech Hub'
      }
    ];

    // 6. Seed Stored Items
    this.storageItems = [
      {
        id: 'item_001',
        userId: customer.id,
        name: 'Winter Down Jackets & Cashmere Quilts',
        category: ItemCategory.CLOTHES,
        description: 'Set of 4 heavy north-India winter coats and 2 handwoven cashmere blankets in vacuum bags.',
        length: 60,
        width: 45,
        height: 35,
        unit: DimensionUnit.CM,
        weightKg: 8.5,
        quantity: 1,
        declaredValueInr: 35000,
        isFragile: false,
        needsSpecialHandling: false,
        packingRequired: true,
        notes: 'Keep in dry, humidity-controlled section.',
        sizeTier: SizeTier.MEDIUM_BOX,
        cubicFeet: 3.3,
        monthlyStorageFeeInr: 399,
        qrCode: 'LUP-ITM-BLR-00192',
        status: StorageItemStatus.STORED,
        binId: 'bin_003',
        binCode: 'B-02-R3-B4',
        storedAt: new Date('2026-01-20T14:30:00Z').toISOString(),
        createdAt: new Date('2026-01-18T10:00:00Z').toISOString(),
        updatedAt: new Date().toISOString(),
        photos: [
          {
            id: 'photo_001',
            itemId: 'item_001',
            url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
            type: PhotoType.CUSTOMER,
            caption: 'Winter clothing set sealed in bags',
            takenAt: new Date('2026-01-18T10:05:00Z').toISOString()
          },
          {
            id: 'photo_002',
            itemId: 'item_001',
            url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80',
            type: PhotoType.WAREHOUSE_INSPECTION,
            caption: 'Intake verification at Bengaluru Hub - Pristine condition',
            takenAt: new Date('2026-01-20T14:25:00Z').toISOString()
          }
        ]
      },
      {
        id: 'item_002',
        userId: customer.id,
        name: 'Ergonomic Mesh Task Chair (Herman Miller style)',
        category: ItemCategory.FURNITURE,
        description: 'Black mesh ergonomic chair with lumbar adjustment. Disassembled base for compact storage.',
        length: 70,
        width: 70,
        height: 100,
        unit: DimensionUnit.CM,
        weightKg: 16.0,
        quantity: 1,
        declaredValueInr: 28000,
        isFragile: false,
        needsSpecialHandling: false,
        packingRequired: true,
        notes: 'Wrapped in industrial bubble wrap and stretch film.',
        sizeTier: SizeTier.EXTRA_LARGE_FURNITURE,
        cubicFeet: 17.3,
        monthlyStorageFeeInr: 1499,
        qrCode: 'LUP-ITM-BLR-00284',
        status: StorageItemStatus.STORED,
        binId: 'bin_005',
        binCode: 'D-01-FURN-09',
        storedAt: new Date('2026-01-20T14:40:00Z').toISOString(),
        createdAt: new Date('2026-01-18T10:15:00Z').toISOString(),
        updatedAt: new Date().toISOString(),
        photos: [
          {
            id: 'photo_003',
            itemId: 'item_002',
            url: 'https://images.unsplash.com/photo-1580481077195-73ab013f636f?w=600&auto=format&fit=crop&q=80',
            type: PhotoType.CUSTOMER,
            caption: 'Mesh chair side profile',
            takenAt: new Date('2026-01-18T10:18:00Z').toISOString()
          }
        ]
      },
      {
        id: 'item_003',
        userId: customer.id,
        name: 'Vintage Legal Reference Library (8 Volumes)',
        category: ItemCategory.BOOKS,
        description: 'Hardbound constitutional commentaries and tax law treatises from 1980-2010.',
        length: 40,
        width: 30,
        height: 30,
        unit: DimensionUnit.CM,
        weightKg: 12.0,
        quantity: 1,
        declaredValueInr: 15000,
        isFragile: false,
        needsSpecialHandling: true,
        packingRequired: true,
        notes: 'Must remain strictly dry with moisture absorbents.',
        sizeTier: SizeTier.SMALL_BOX,
        cubicFeet: 1.3,
        monthlyStorageFeeInr: 199,
        qrCode: 'LUP-ITM-BLR-00311',
        status: StorageItemStatus.STORED,
        binId: 'bin_001',
        binCode: 'A-01-R1-B1',
        storedAt: new Date('2026-01-20T14:45:00Z').toISOString(),
        createdAt: new Date('2026-01-18T10:20:00Z').toISOString(),
        updatedAt: new Date().toISOString(),
        photos: [
          {
            id: 'photo_004',
            itemId: 'item_003',
            url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
            type: PhotoType.CUSTOMER,
            caption: 'Hardcover book collection',
            takenAt: new Date('2026-01-18T10:22:00Z').toISOString()
          }
        ]
      },
      {
        id: 'item_004',
        userId: customer.id,
        name: 'Campagnolo Road Bicycle (Carbon Frame)',
        category: ItemCategory.SPORTS_FITNESS,
        description: '54cm matte black racing cycle. Pedals removed and placed in attached pouch.',
        length: 150,
        width: 30,
        height: 90,
        unit: DimensionUnit.CM,
        weightKg: 8.8,
        quantity: 1,
        declaredValueInr: 75000,
        isFragile: true,
        needsSpecialHandling: true,
        packingRequired: true,
        notes: 'High-value carbon frame. Handle with care.',
        sizeTier: SizeTier.EXTRA_LARGE_FURNITURE,
        cubicFeet: 14.3,
        monthlyStorageFeeInr: 1499,
        qrCode: 'LUP-ITM-BLR-00455',
        status: StorageItemStatus.STORED,
        binId: 'bin_004',
        binCode: 'C-01-VAULT-01',
        storedAt: new Date('2026-01-20T14:50:00Z').toISOString(),
        createdAt: new Date('2026-01-18T10:30:00Z').toISOString(),
        updatedAt: new Date().toISOString(),
        photos: [
          {
            id: 'photo_005',
            itemId: 'item_004',
            url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
            type: PhotoType.CUSTOMER,
            caption: 'Carbon road bike in pristine state',
            takenAt: new Date('2026-01-18T10:32:00Z').toISOString()
          }
        ]
      }
    ];

    // 7. Seed Active Bookings / Pickups
    this.pickupRequests = [
      {
        id: 'pickup_001',
        bookingNumber: 'LUP-PK-2026-0182',
        userId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        address: this.addresses[0],
        slotDate: '2026-11-09',
        slotStartTime: '10:00 AM',
        slotEndTime: '12:00 PM',
        status: PickupStatus.DRIVER_ON_THE_WAY,
        driverId: this.drivers[0].id,
        driverName: driverUser.name,
        driverPhone: driverUser.phone,
        driverVehicleNumber: this.drivers[0].vehicleNumber,
        driverVehicleType: this.drivers[0].vehicleType,
        driverCurrentLat: 12.9782,
        driverCurrentLng: 77.6408,
        pickupOtp: '4829',
        notes: 'Please bring 2 large heavy-duty carton boxes and bubble wrap.',
        totalAmount: 1845,
        pickupFee: 149,
        monthlyStorage: 1499,
        commitmentMonths: 6,
        items: [this.storageItems[1]],
        createdAt: new Date('2026-11-08T08:00:00Z').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pickup_002',
        bookingNumber: 'LUP-PK-2026-0091',
        userId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        address: this.addresses[0],
        slotDate: '2026-01-20',
        slotStartTime: '02:00 PM',
        slotEndTime: '04:00 PM',
        status: PickupStatus.RECEIVED_AT_WAREHOUSE,
        driverId: this.drivers[0].id,
        driverName: driverUser.name,
        driverPhone: driverUser.phone,
        driverVehicleNumber: this.drivers[0].vehicleNumber,
        driverVehicleType: this.drivers[0].vehicleType,
        pickupOtp: '7193',
        totalAmount: 2478,
        pickupFee: 149,
        monthlyStorage: 2097,
        commitmentMonths: 3,
        items: [this.storageItems[0], this.storageItems[2], this.storageItems[3]],
        createdAt: new Date('2026-01-18T10:00:00Z').toISOString(),
        updatedAt: new Date('2026-01-20T14:50:00Z').toISOString()
      }
    ];

    // 8. Seed Return Requests
    this.returnRequests = [
      {
        id: 'ret_001',
        returnNumber: 'LUP-RT-2026-0012',
        userId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        address: this.addresses[0],
        slotDate: '2026-11-12',
        slotTime: '04:00 PM - 06:00 PM',
        status: ReturnStatus.REQUESTED,
        driverId: null,
        deliveryOtp: '9182',
        feeAmount: 149.0,
        itemIds: ['item_003'],
        items: [this.storageItems[2]],
        notes: 'Returning legal books ahead of litigation review.',
        createdAt: new Date('2026-11-08T18:00:00Z').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 9. Invoices
    this.invoices = [
      {
        id: 'inv_001',
        invoiceNumber: 'INV-2026-00041',
        userId: customer.id,
        customerName: customer.name,
        amount: 2097,
        taxAmount: 377.46,
        totalAmount: 2474.46,
        periodStart: '2026-01-20',
        periodEnd: '2026-02-20',
        status: InvoiceStatus.PAID,
        paidAt: '2026-01-20T11:30:00Z',
        createdAt: '2026-01-20T11:00:00Z',
        pdfUrl: '/api/v1/invoices/inv_001/pdf'
      },
      {
        id: 'inv_002',
        invoiceNumber: 'INV-2026-00118',
        userId: customer.id,
        customerName: customer.name,
        amount: 2097,
        taxAmount: 377.46,
        totalAmount: 2474.46,
        periodStart: '2026-02-20',
        periodEnd: '2026-03-20',
        status: InvoiceStatus.PAID,
        paidAt: '2026-02-20T09:15:00Z',
        createdAt: '2026-02-20T09:00:00Z',
        pdfUrl: '/api/v1/invoices/inv_002/pdf'
      },
      {
        id: 'inv_003',
        invoiceNumber: 'INV-2026-00994',
        userId: customer.id,
        customerName: customer.name,
        amount: 3596,
        taxAmount: 647.28,
        totalAmount: 4243.28,
        periodStart: '2026-11-01',
        periodEnd: '2026-12-01',
        status: InvoiceStatus.ISSUED,
        paidAt: null,
        createdAt: '2026-11-01T00:00:00Z',
        pdfUrl: '/api/v1/invoices/inv_003/pdf'
      }
    ];

    // 10. Support Tickets
    this.tickets = [
      {
        id: 'tkt_001',
        ticketNumber: 'TKT-2026-0104',
        userId: customer.id,
        userName: customer.name,
        subject: 'Can I add another box during the scheduled pickup?',
        category: 'Booking & Pickup',
        priority: TicketPriority.MEDIUM,
        status: TicketStatus.RESOLVED,
        createdAt: new Date('2026-01-19T14:00:00Z').toISOString(),
        updatedAt: new Date('2026-01-19T15:20:00Z').toISOString(),
        messages: [
          {
            id: 'msg_001',
            senderId: customer.id,
            senderName: customer.name,
            senderRole: UserRole.CUSTOMER,
            message: 'Hi team, I found one more carton of books. Can your driver carry an extra box during tomorrow pickup?',
            createdAt: new Date('2026-01-19T14:00:00Z').toISOString()
          },
          {
            id: 'msg_002',
            senderId: admin.id,
            senderName: 'Lootup Support (Siddharth)',
            senderRole: UserRole.ADMIN,
            message: 'Hello Aarav! Yes absolutely, our driver Ramesh carries extra empty crates. He will scan and add it to your digital inventory on the spot.',
            createdAt: new Date('2026-01-19T15:20:00Z').toISOString()
          }
        ]
      }
    ];

    // 11. Coupons
    this.coupons = [
      {
        id: 'cpn_001',
        code: 'WELCOME100',
        description: 'Flat ₹100 off on your first storage booking',
        flatDiscountInr: 100,
        isActive: true
      },
      {
        id: 'cpn_002',
        code: 'LOOTUP50',
        description: 'Flat ₹50 off on pickup charges',
        flatDiscountInr: 50,
        isActive: true
      },
      {
        id: 'cpn_003',
        code: 'FREESHIP',
        description: 'Free doorstep pickup for bookings of 6 months or more',
        flatDiscountInr: 149,
        isActive: true
      }
    ];

    // 12. Audit Logs
    this.auditLogs = [
      {
        id: 'audit_001',
        userId: admin.id,
        action: 'PRICING_RULE_UPDATE',
        resource: 'PricingTier:MEDIUM_BOX',
        details: 'Admin verified Tier 2 rates for Bengaluru and Mumbai',
        ipAddress: '103.21.144.10',
        createdAt: new Date('2026-11-01T10:00:00Z').toISOString()
      },
      {
        id: 'audit_002',
        userId: driverUser.id,
        action: 'PICKUP_DISPATCH',
        resource: 'PickupRequest:pickup_001',
        details: 'Driver Ramesh marked en route to HAL 2nd stage Indiranagar',
        ipAddress: '157.44.19.22',
        createdAt: new Date('2026-11-08T09:30:00Z').toISOString()
      }
    ];
  }
}

// Global singleton instance for in-memory operation
const globalForMockDb = globalThis as unknown as { lootupMockDb: LootupMockDatabase };
export const mockDb = globalForMockDb.lootupMockDb || new LootupMockDatabase();
if (process.env.NODE_ENV !== 'production') globalForMockDb.lootupMockDb = mockDb;

