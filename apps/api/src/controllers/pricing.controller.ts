import { Router, Request, Response } from 'express';
import { calculateStoragePrice, SERVICEABLE_CITIES, DEFAULT_PRICING_TIERS, PRICING_CONFIG, RESTRICTED_PROHIBITED_ITEMS } from '@lootupspace/shared';
import { mockDb } from '@lootupspace/database';

export const pricingRouter = Router();

pricingRouter.post('/calculate', (req: Request, res: Response) => {
  try {
    const result = calculateStoragePrice(req.body);
    return res.json({ success: true, result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

pricingRouter.get('/tiers', (req: Request, res: Response) => {
  return res.json({
    success: true,
    tiers: DEFAULT_PRICING_TIERS,
    addons: PRICING_CONFIG.ADDONS,
    insuranceTiers: PRICING_CONFIG.INSURANCE_TIERS,
    discounts: PRICING_CONFIG.COMMITMENT_DISCOUNTS
  });
});

pricingRouter.get('/cities', (req: Request, res: Response) => {
  return res.json({
    success: true,
    cities: SERVICEABLE_CITIES
  });
});

pricingRouter.get('/check-pincode/:pincode', (req: Request, res: Response) => {
  const pin = req.params.pincode.trim();
  const found = mockDb.serviceablePincodes.find(p => p.pincode === pin);

  if (found) {
    const city = mockDb.cities.find(c => c.id === found.cityId);
    return res.json({
      success: true,
      isServiceable: true,
      city: city?.name,
      hub: found.hubName
    });
  }

  return res.json({
    success: true,
    isServiceable: false,
    message: 'We are expanding rapidly to your area. Join our priority waitlist!'
  });
});

pricingRouter.post('/waitlist', (req: Request, res: Response) => {
  const { pincode, phone, email, name, city } = req.body;
  const lead = {
    id: `lead_${Date.now()}`,
    pincode,
    phone,
    email: email || null,
    name: name || null,
    city: city || null,
    createdAt: new Date().toISOString()
  };
  mockDb.waitlistLeads.push(lead);
  return res.json({
    success: true,
    message: 'Thank you! You have been added to the priority notification waitlist.',
    lead
  });
});

pricingRouter.get('/restricted-items', (req: Request, res: Response) => {
  return res.json({
    success: true,
    items: RESTRICTED_PROHIBITED_ITEMS
  });
});

