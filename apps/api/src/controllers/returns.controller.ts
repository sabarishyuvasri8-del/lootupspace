import { Router, Request, Response } from 'express';
import { ReturnsService } from '../services/returns.service';
import { CreateReturnRequestSchema } from '@lootupspace/shared';
import { authGuard } from '../middleware/auth.guard';

export const returnsRouter = Router();

returnsRouter.post('/', authGuard, async (req: Request, res: Response) => {
  try {
    const validated = CreateReturnRequestSchema.parse(req.body);
    const returnReq = await ReturnsService.requestReturn(req.user!.id, validated);
    return res.status(201).json({ success: true, returnRequest: returnReq });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

returnsRouter.get('/', authGuard, async (req: Request, res: Response) => {
  try {
    const returns = await ReturnsService.getUserReturns(req.user!.id);
    return res.json({ success: true, returns });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

returnsRouter.get('/:id', authGuard, async (req: Request, res: Response) => {
  try {
    const returnReq = await ReturnsService.getReturnById(req.params.id);
    return res.json({ success: true, returnRequest: returnReq });
  } catch (err: any) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

