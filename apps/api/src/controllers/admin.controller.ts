import { Router, Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { UserRole } from '@lootupspace/shared';
import { authGuard, requireRole } from '../middleware/auth.guard';
import { mockDb } from '@lootupspace/database';

export const adminRouter = Router();

adminRouter.use(authGuard, requireRole([UserRole.ADMIN]));

adminRouter.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await AdminService.getPlatformStats();
    return res.json({ success: true, ...stats });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await AdminService.getAllOrders();
    return res.json({ success: true, ...orders });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.post('/reassign-driver', async (req: Request, res: Response) => {
  try {
    const { orderType, orderId, driverId } = req.body;
    const result = await AdminService.reassignDriver(orderType, orderId, driverId);
    await AdminService.recordAuditLog(req.user!.id, 'DRIVER_REASSIGNED', `${orderType}:${orderId}`);
    return res.json({ success: true, order: result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

adminRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    const customers = mockDb.users.filter(u => u.role === UserRole.CUSTOMER).map(u => {
      const itemsCount = mockDb.storageItems.filter(i => i.userId === u.id).length;
      const pickupsCount = mockDb.pickupRequests.filter(p => p.userId === u.id).length;
      return { ...u, itemsCount, pickupsCount };
    });
    return res.json({ success: true, customers });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.get('/drivers', async (req: Request, res: Response) => {
  try {
    const drivers = mockDb.drivers.map(d => {
      const user = mockDb.users.find(u => u.id === d.userId);
      return { ...d, user };
    });
    return res.json({ success: true, drivers });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const logs = await AdminService.getAuditLogs();
    return res.json({ success: true, logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

