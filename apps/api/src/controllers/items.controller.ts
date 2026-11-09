import { Router, Request, Response } from 'express';
import { ItemsService } from '../services/items.service';
import { AddItemSchema } from '@lootupspace/shared';
import { authGuard } from '../middleware/auth.guard';

export const itemsRouter = Router();

itemsRouter.post('/', authGuard, async (req: Request, res: Response) => {
  try {
    const validated = AddItemSchema.parse(req.body);
    const item = await ItemsService.createItem(req.user!.id, validated);
    return res.status(201).json({ success: true, item });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

itemsRouter.get('/', authGuard, async (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;
    const items = await ItemsService.getUserItems(req.user!.id, {
      category: category as string,
      status: status as string,
      search: search as string
    });
    return res.json({ success: true, items });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

itemsRouter.get('/:id', authGuard, async (req: Request, res: Response) => {
  try {
    const item = await ItemsService.getItemById(req.params.id);
    return res.json({ success: true, item });
  } catch (err: any) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

itemsRouter.get('/:id/qr', async (req: Request, res: Response) => {
  try {
    const qrData = await ItemsService.getItemQrData(req.params.id);
    return res.json({ success: true, ...qrData });
  } catch (err: any) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

itemsRouter.delete('/:id', authGuard, async (req: Request, res: Response) => {
  try {
    const result = await ItemsService.deleteDraftItem(req.params.id, req.user!.id);
    return res.json({ ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
