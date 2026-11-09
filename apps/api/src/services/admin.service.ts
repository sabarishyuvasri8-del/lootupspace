import { mockDb } from '@lootupspace/database';
import { StorageItemStatus } from '@lootupspace/shared';

export class AdminService {
  static async getPlatformStats(): Promise<any> {
    const totalCustomers = mockDb.users.filter(u => u.role === 'CUSTOMER').length;
    const totalItems = mockDb.storageItems.length;
    const storedItems = mockDb.storageItems.filter(i => i.status === StorageItemStatus.STORED).length;

    const mrr = mockDb.storageItems
      .filter(i => i.status === StorageItemStatus.STORED)
      .reduce((sum, item) => sum + (item.monthlyStorageFeeInr || 399), 0);

    const totalRevenue = mockDb.invoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const pickupsToday = mockDb.pickupRequests.length;
    const pendingReturns = mockDb.returnRequests.filter(r => r.status === 'REQUESTED').length;
    const overdueInvoices = mockDb.invoices.filter(inv => inv.status === 'OVERDUE').length;

    const warehouse = mockDb.warehouses[0];
    const usedCuFt = mockDb.storageItems
      .filter(i => i.status === StorageItemStatus.STORED)
      .reduce((sum, it) => sum + (it.cubicFeet || 2.0), 0);

    const utilizationPercent = Math.min(100, Math.round((usedCuFt / (warehouse?.totalCubicFeet || 50000)) * 100));

    return {
      totalCustomers,
      totalItems,
      storedItems,
      mrr,
      totalRevenue,
      pickupsToday,
      pendingReturns,
      overdueInvoices,
      utilizationPercent,
      activeDriversCount: mockDb.drivers.length,
      revenueChartData: [
        { month: 'Jun', revenue: 142000, mrr: 120000 },
        { month: 'Jul', revenue: 198000, mrr: 165000 },
        { month: 'Aug', revenue: 265000, mrr: 215000 },
        { month: 'Sep', revenue: 340000, mrr: 290000 },
        { month: 'Oct', revenue: 425000, mrr: 380000 },
        { month: 'Nov', revenue: 512000, mrr: 460000 }
      ]
    };
  }

  static async getAllOrders(): Promise<{ pickups: any[]; returns: any[] }> {
    return {
      pickups: mockDb.pickupRequests,
      returns: mockDb.returnRequests
    };
  }

  static async reassignDriver(orderType: 'PICKUP' | 'RETURN', orderId: string, driverId: string): Promise<any> {
    const driver = mockDb.drivers.find(d => d.id === driverId) || mockDb.drivers[0];
    const driverUser = mockDb.users.find(u => u.id === driver.userId);

    if (orderType === 'PICKUP') {
      const order = mockDb.pickupRequests.find(p => p.id === orderId);
      if (!order) throw new Error('Pickup request not found');
      order.driverId = driver.id;
      order.driverName = driverUser?.name || 'Assigned Driver';
      order.driverPhone = driverUser?.phone || '+919876543211';
      order.driverVehicleNumber = driver.vehicleNumber;
      order.driverVehicleType = driver.vehicleType;
      order.updatedAt = new Date().toISOString();
      return order;
    } else {
      const order = mockDb.returnRequests.find(r => r.id === orderId);
      if (!order) throw new Error('Return request not found');
      order.driverId = driver.id;
      order.driverName = driverUser?.name || 'Assigned Driver';
      order.driverPhone = driverUser?.phone || '+919876543211';
      order.updatedAt = new Date().toISOString();
      return order;
    }
  }

  static async recordAuditLog(userId: string, action: string, resource: string, details?: string, ip?: string) {
    const log = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      action,
      resource,
      details: details || null,
      ipAddress: ip || '127.0.0.1',
      createdAt: new Date().toISOString()
    };
    mockDb.auditLogs.unshift(log);
    return log;
  }

  static async getAuditLogs(): Promise<any[]> {
    return mockDb.auditLogs;
  }
}

