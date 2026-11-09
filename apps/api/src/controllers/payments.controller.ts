import { Router, Request, Response } from 'express';
import { PaymentsService } from '../services/payments.service';
import { authGuard } from '../middleware/auth.guard';

export const paymentsRouter = Router();

paymentsRouter.post('/create-order', authGuard, async (req: Request, res: Response) => {
  try {
    const { amount, purpose } = req.body;
    const order = await PaymentsService.createRazorpayOrder(req.user!.id, amount, purpose);
    return res.json({ success: true, ...order });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

paymentsRouter.post('/verify', authGuard, async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const result = await PaymentsService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    return res.json({ ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

paymentsRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);
    const result = await PaymentsService.handleWebhook(signature, rawBody, req.body);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

paymentsRouter.get('/invoices', authGuard, async (req: Request, res: Response) => {
  try {
    const invoices = await PaymentsService.getUserInvoices(req.user!.id);
    return res.json({ success: true, invoices });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
