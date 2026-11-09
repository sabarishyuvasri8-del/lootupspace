import { Router, Request, Response } from 'express';
import { WarehouseService } from '../services/warehouse.service';
import { WarehouseIntakeSchema, UserRole } from '@lootupspace/shared';
import { authGuard, requireRole } from '../middleware/auth.guard';

export const warehouseRouter = Router();

// Scanning an item QR for inbound intake
warehouseRouter.get('/scan/:qrCode', authGuard, requireRole([UserRole.WAREHOUSE, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const result = await WarehouseService.scanItemQr(req.params.qrCode);
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

// Intake completion & bin placement
warehouseRouter.post('/intake', authGuard, requireRole([UserRole.WAREHOUSE, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const validated = WarehouseIntakeSchema.parse(req.body);
    const result = await WarehouseService.completeItemIntake(
      validated.itemId,
      validated.verifiedSizeTier,
      validated.binCode,
      validated.inspectionNotes,
      validated.intakePhotoUrl
    );
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Warehouse map & capacity metrics
warehouseRouter.get('/map', authGuard, requireRole([UserRole.WAREHOUSE, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const mapData = await WarehouseService.getWarehouseInventoryMap();
    return res.json({ success: true, ...mapData });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Outbound pick list
warehouseRouter.get('/outbound', authGuard, requireRole([UserRole.WAREHOUSE, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const pickList = await WarehouseService.getOutboundPickList();
    return res.json({ success: true, pickList });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Printable labels
warehouseRouter.post('/labels', authGuard, requireRole([UserRole.WAREHOUSE, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { itemIds } = req.body;
    const labels = await WarehouseService.generatePrintableLabels(itemIds);
    return res.json({ success: true, labels });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

