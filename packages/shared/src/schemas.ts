import { z } from 'zod';
import { DimensionUnit, ItemCategory, SizeTier, UserRole, VehicleType, ZoneType } from './enums';

export const PhoneLoginSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format. Must include country code or 10 digits.')
});

export const VerifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  name: z.string().optional(),
  email: z.string().email().optional()
});

export const AddItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  category: z.nativeEnum(ItemCategory),
  description: z.string().optional(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  unit: z.nativeEnum(DimensionUnit).default(DimensionUnit.CM),
  weightKg: z.number().positive().default(5.0),
  quantity: z.number().int().positive().default(1),
  declaredValueInr: z.number().nonnegative().default(1000),
  isFragile: z.boolean().default(false),
  needsSpecialHandling: z.boolean().default(false),
  packingRequired: z.boolean().default(false),
  notes: z.string().optional(),
  sizeTier: z.nativeEnum(SizeTier).optional(),
  photos: z.array(z.string()).min(1, 'Please upload at least 1 photo of the item')
});

export const AddressSchema = z.object({
  label: z.string().default('Home'),
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Indian pincode'),
  lat: z.number().default(12.9716),
  lng: z.number().default(77.5946),
  isDefault: z.boolean().default(true)
});

export const SchedulePickupSchema = z.object({
  addressId: z.string().optional(),
  newAddress: AddressSchema.optional(),
  itemIds: z.array(z.string()).min(1, 'At least one item must be selected for pickup'),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Slot date must be in YYYY-MM-DD format'),
  slotStartTime: z.string(),
  slotEndTime: z.string(),
  commitmentMonths: z.union([z.literal(3), z.literal(6), z.literal(12)]).default(3),
  priorityPickup: z.boolean().default(false),
  insuranceTierId: z.string().default('BASIC'),
  packingMaterials: z.boolean().default(false),
  couponCode: z.string().optional(),
  notes: z.string().optional()
});

export const CreateReturnRequestSchema = z.object({
  addressId: z.string().optional(),
  newAddress: AddressSchema.optional(),
  itemIds: z.array(z.string()).min(1, 'Select at least one stored item to return'),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Slot date must be in YYYY-MM-DD format'),
  slotTime: z.string(),
  cleaningBeforeReturn: z.boolean().default(false),
  notes: z.string().optional()
});

export const DriverPickupVerificationSchema = z.object({
  pickupRequestId: z.string(),
  customerOtp: z.string().length(4, 'Handover OTP must be 4 digits'),
  verifiedItemIds: z.array(z.string()),
  photoProofUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  notes: z.string().optional(),
  itemAdjustments: z.array(
    z.object({
      itemId: z.string(),
      adjustedTier: z.nativeEnum(SizeTier).optional(),
      adjustedWeightKg: z.number().optional(),
      notes: z.string().optional()
    })
  ).optional()
});

export const WarehouseIntakeSchema = z.object({
  itemId: z.string(),
  verifiedSizeTier: z.nativeEnum(SizeTier),
  binCode: z.string().min(3, 'Bin location code is required (e.g. A-03-R2-B5)'),
  inspectionNotes: z.string().optional(),
  intakePhotoUrl: z.string().optional()
});

export const CreateTicketSchema = z.object({
  subject: z.string().min(5, 'Subject is too short'),
  category: z.string().min(2),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  message: z.string().min(10, 'Please describe your request or issue')
});

export const AddTicketMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty')
});

export const KycSubmissionSchema = z.object({
  documentType: z.enum(['AADHAAR', 'PAN', 'DRIVING_LICENCE', 'PASSPORT']),
  documentNumber: z.string().min(4),
  documentFileUrl: z.string().min(5)
});

