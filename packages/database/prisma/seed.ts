import { PrismaClient, Role, UserStatus, KycStatus, ZoneType, SizeTier } from '@prisma/client';
import { SERVICEABLE_CITIES, DEFAULT_PRICING_TIERS, PRICING_CONFIG, DEMO_USERS } from '@lootupspace/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Lootupspace Database...');

  // 1. Cities & Pincodes
  for (const cityData of SERVICEABLE_CITIES) {
    const city = await prisma.city.upsert({
      where: { code: cityData.code },
      update: {},
      create: {
        code: cityData.code,
        name: cityData.name,
        state: cityData.state,
        isActive: cityData.active
      }
    });

    for (let i = 0; i < cityData.pincodes.length; i++) {
      const pin = cityData.pincodes[i];
      await prisma.serviceablePincode.upsert({
        where: { pincode: pin },
        update: {},
        create: {
          cityId: city.id,
          pincode: pin,
          hubName: cityData.hubs[i % cityData.hubs.length],
          isServiceable: true
        }
      });
    }
  }

  // 2. Demo Users
  const customer = await prisma.user.upsert({
    where: { phone: DEMO_USERS.CUSTOMER.phone },
    update: {},
    create: {
      phone: DEMO_USERS.CUSTOMER.phone,
      email: DEMO_USERS.CUSTOMER.email,
      name: DEMO_USERS.CUSTOMER.name,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'AARAV200'
    }
  });

  const driverUser = await prisma.user.upsert({
    where: { phone: DEMO_USERS.DRIVER.phone },
    update: {},
    create: {
      phone: DEMO_USERS.DRIVER.phone,
      email: DEMO_USERS.DRIVER.email,
      name: DEMO_USERS.DRIVER.name,
      role: Role.DRIVER,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'RAMESH100'
    }
  });

  const warehouseStaff = await prisma.user.upsert({
    where: { phone: DEMO_USERS.WAREHOUSE.phone },
    update: {},
    create: {
      phone: DEMO_USERS.WAREHOUSE.phone,
      email: DEMO_USERS.WAREHOUSE.email,
      name: DEMO_USERS.WAREHOUSE.name,
      role: Role.WAREHOUSE,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'PRIYA100'
    }
  });

  const admin = await prisma.user.upsert({
    where: { phone: DEMO_USERS.ADMIN.phone },
    update: {},
    create: {
      phone: DEMO_USERS.ADMIN.phone,
      email: DEMO_USERS.ADMIN.email,
      name: DEMO_USERS.ADMIN.name,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
      referralCode: 'ADMIN001'
    }
  });

  // 3. Driver profile
  await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: {
      userId: driverUser.id,
      vehicleNumber: 'KA-01-EJ-4912',
      licenseNumber: 'KA0120190038921',
      isAvailable: true,
      currentLat: 12.9782,
      currentLng: 77.6408,
      totalTripsDone: 142,
      ratingAverage: 4.9
    }
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

