import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { PhoneLoginSchema, VerifyOtpSchema, UserRole } from '@lootupspace/shared';
import { authGuard } from '../middleware/auth.guard';

export const authRouter = Router();

authRouter.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const validated = PhoneLoginSchema.parse(req.body);
    const result = await AuthService.sendOtp(validated.phone);
    return res.json({ ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

authRouter.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const validated = VerifyOtpSchema.parse(req.body);
    const result = await AuthService.verifyOtp(
      validated.phone,
      validated.otp,
      validated.name,
      validated.email
    );
    return res.json({ ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

authRouter.post('/demo-login', async (req: Request, res: Response) => {
  try {
    const role = (req.body.role || UserRole.CUSTOMER) as UserRole;
    const result = await AuthService.demoLogin(role);
    return res.json({ ...result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

authRouter.get('/me', authGuard, async (req: Request, res: Response) => {
  return res.json({ success: true, user: req.user });
});

authRouter.post('/kyc', authGuard, async (req: Request, res: Response) => {
  try {
    const { documentType, documentNumber, documentFileUrl } = req.body;
    const result = await AuthService.submitKyc(
      req.user!.id,
      documentType,
      documentNumber,
      documentFileUrl
    );
    return res.json({ success: true, user: result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
