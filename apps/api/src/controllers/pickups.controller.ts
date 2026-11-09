import { Router, Request, Response } from 'express';
import { PickupsService } from '../services/pickups.service';
import { SchedulePickupSchema } from '@lootupspace/shared';
import { authGuard } from '../middleware/auth.guard';

export const pickupsRouter = Router();

pickupsRouter.post('/', authGuard, async (req: Request, res: Response) => {
  try {
    const validated = SchedulePickupSchema.parse(req.body);
    const pickup = await PickupsService.schedulePickup(req.user!.id, validated);
    return res.status(201).json({ success: true, pickup });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

pickupsRouter.get('/', authGuard, async (req: Request, res: Response) => {
  try {
    const pickups = await PickupsService.getUserPickups(req.user!.id);
    return res.json({ success: true, pickups });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

pickupsRouter.get('/:id', authGuard, async (req: Request, res: Response) => {
  try {
    const pickup = await PickupsService.getPickupById(req.params.id);
    return res.json({ success: true, pickup });
  } catch (err: any) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

pickupsRouter.patch('/:id/status', authGuard, async (req: Request, res: Response) => {
  try {
    const { status, extraData } = req.body;
    const updated = await PickupsService.updatePickupStatus(req.params.id, status, extraData);
    return res.json({ success: true, pickup: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

