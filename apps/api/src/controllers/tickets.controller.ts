import { Router, Request, Response } from 'express';
import { TicketsService } from '../services/tickets.service';
import { CreateTicketSchema, AddTicketMessageSchema, UserRole } from '@lootupspace/shared';
import { authGuard } from '../middleware/auth.guard';

export const ticketsRouter = Router();

ticketsRouter.post('/', authGuard, async (req: Request, res: Response) => {
  try {
    const validated = CreateTicketSchema.parse(req.body);
    const ticket = await TicketsService.createTicket(req.user!.id, validated);
    return res.status(201).json({ success: true, ticket });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

ticketsRouter.get('/', authGuard, async (req: Request, res: Response) => {
  try {
    const isStaff = req.user!.role === UserRole.ADMIN || req.user!.role === UserRole.WAREHOUSE;
    const tickets = await TicketsService.getTickets(isStaff ? undefined : req.user!.id);
    return res.json({ success: true, tickets });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

ticketsRouter.get('/:id', authGuard, async (req: Request, res: Response) => {
  try {
    const ticket = await TicketsService.getTicketById(req.params.id);
    return res.json({ success: true, ticket });
  } catch (err: any) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

ticketsRouter.post('/:id/messages', authGuard, async (req: Request, res: Response) => {
  try {
    const validated = AddTicketMessageSchema.parse(req.body);
    const ticket = await TicketsService.addMessage(req.params.id, req.user!.id, validated.message);
    return res.json({ success: true, ticket });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

