import { Router, Request, Response } from 'express';
import { DriverService } from '../services/driver.service';
import { DriverPickupVerificationSchema, UserRole } from '@lootupspace/shared';
import { authGuard, requireRole } from '../middleware/auth.guard';

export const driverRouter = Router();

driverRouter.get('/jobs', authGuard, requireRole([UserRole.DRIVER, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const jobs = await DriverService.getDriverJobs(req.user!.id);
    return res.json({ success: true, ...jobs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

driverRouter.post('/location', authGuard, requireRole([UserRole.DRIVER, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;
    const result = await DriverService.updateDriverLocation(req.user!.id, lat, lng);
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

driverRouter.post('/verify-pickup', authGuard, requireRole([UserRole.DRIVER, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const validated = DriverPickupVerificationSchema.parse(req.body);
    const result = await DriverService.verifyPickupHandover(
      validated.pickupRequestId,
      validated.customerOtp,
      validated.verifiedItemIds,
      validated.photoProofUrl,
      validated.signatureUrl,
      validated.itemAdjustments
    );
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

driverRouter.post('/verify-delivery', authGuard, requireRole([UserRole.DRIVER, UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { returnRequestId, deliveryOtp, proofPhotoUrl, signatureUrl } = req.body;
    const result = await DriverService.verifyDeliveryHandover(
      returnRequestId,
      deliveryOtp,
      proofPhotoUrl,
      signatureUrl
    );
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

