import { mockDb, LootupMockDatabase } from './mock-db';

let prismaInstance: any = null;

if (typeof window === 'undefined') {
  try {
    // Dynamic require to prevent client bundlers from resolving @prisma/client
    const req = typeof require !== 'undefined' ? require : (0, eval)('require');
    const { PrismaClient } = req('@prisma/client');
    const globalForPrisma = globalThis as unknown as { prisma: any };
    prismaInstance = globalForPrisma.prisma || new PrismaClient();
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (e) {
    // Prisma client not available; fallback to mockDb
    prismaInstance = null;
  }
}

export const prisma = prismaInstance;
export { mockDb, LootupMockDatabase };
