import {
  UserRole,
  UserStatus,
  KycStatus,
  ItemCategory,
  SizeTier,
  DimensionUnit,
  StorageItemStatus,
  PickupStatus,
  ReturnStatus,
  SubscriptionStatus,
  PaymentStatus,
  InvoiceStatus,
  PhotoType,
  TicketStatus,
  TicketPriority,
  VehicleType,
  ZoneType
} from './enums';

export interface UserDTO {
  id: string;
  phone: string;
  email?: string | null;
  name?: string | null;
  role: UserRole;
  status: UserStatus;
  kycStatus: KycStatus;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDTO {
  id: string;
  userId: string;
  label: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface ItemPhotoDTO {
  id: string;
  itemId: string;
  url: string;
  type: PhotoType;
  caption?: string | null;
  takenAt: string;
}

export interface StorageItemDTO {
  id: string;
  userId: string;
  name: string;
  category: ItemCategory;
  description?: string | null;
  length: number;
  width: number;
  height: number;
  unit: DimensionUnit;
  weightKg: number;
  quantity: number;
  declaredValueInr: number;
  isFragile: boolean;
  needsSpecialHandling: boolean;
  packingRequired: boolean;
  notes?: string | null;
  sizeTier: SizeTier;
  cubicFeet: number;
  monthlyStorageFeeInr: number;
  qrCode: string;
  status: StorageItemStatus;
  binId?: string | null;
  binCode?: string | null;
  photos: ItemPhotoDTO[];
  storedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddItemInput {
  name: string;
  category: ItemCategory;
  description?: string;
  length?: number;
  width?: number;
  height?: number;
  unit?: DimensionUnit;
  weightKg?: number;
  quantity?: number;
  declaredValueInr: number;
  isFragile?: boolean;
  needsSpecialHandling?: boolean;
  packingRequired?: boolean;
  notes?: string;
  sizeTier?: SizeTier;
  photos: string[]; // Base64 or signed URLs
}

export interface PriceCalculationInput {
  items: Array<{
    sizeTier?: SizeTier;
    length?: number;
    width?: number;
    height?: number;
    unit?: DimensionUnit;
    quantity: number;
    declaredValueInr?: number;
    packingRequired?: boolean;
    materialsRequired?: boolean;
  }>;
  commitmentMonths: 3 | 6 | 12;
  distanceKm?: number;
  priorityPickup?: boolean;
  cleaningService?: boolean;
  insuranceTierId?: string;
  couponCode?: string;
}

export interface PriceBreakdownItem {
  name: string;
  description: string;
  quantity: number;
  unitMonthlyPrice: number;
  totalMonthlyPrice: number;
  sizeTier: SizeTier;
  cubicFeet: number;
}

export interface PriceCalculationResult {
  monthlyStorageSubtotal: number;
  commitmentMonths: number;
  commitmentDiscountPercent: number;
  commitmentDiscountAmount: number;
  discountedMonthlyStorage: number;
  totalStorageForCommitment: number;
  
  // Trip & Addons
  pickupFee: number;
  packingServiceFee: number;
  packingMaterialsFee: number;
  priorityPickupFee: number;
  insuranceMonthlyFee: number;
  cleaningFee: number;
  
  couponDiscountAmount: number;
  
  // Totals
  oneTimeChargesSubtotal: number;
  monthlyRecurringSubtotal: number;
  
  // Taxes (18% GST)
  oneTimeGst: number;
  monthlyRecurringGst: number;
  
  totalDueToday: number;
  monthlyRecurringTotal: number;
  
  itemsBreakdown: PriceBreakdownItem[];
}

export interface PickupRequestDTO {
  id: string;
  bookingNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  address: AddressDTO;
  slotDate: string;
  slotStartTime: string;
  slotEndTime: string;
  status: PickupStatus;
  driverId?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  driverVehicleNumber?: string | null;
  driverVehicleType?: VehicleType | null;
  driverCurrentLat?: number | null;
  driverCurrentLng?: number | null;
  pickupOtp: string;
  totalAmount: number;
  monthlyStorageFee: number;
  commitmentMonths: number;
  items: StorageItemDTO[];
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequestDTO {
  id: string;
  returnNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  address: AddressDTO;
  slotDate: string;
  slotTime: string;
  status: ReturnStatus;
  driverId?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  deliveryOtp: string;
  feeAmount: number;
  itemIds: string[];
  items: StorageItemDTO[];
  proofPhotoUrl?: string | null;
  recipientSignatureUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseBinDTO {
  id: string;
  code: string; // e.g. A-03-R2-B5
  zoneName: string;
  zoneType: ZoneType;
  maxCubicFeet: number;
  currentCubicFeet: number;
  occupiedPercent: number;
  warehouseName: string;
  storedItemsCount: number;
}

export interface InvoiceDTO {
  id: string;
  invoiceNumber: string;
  userId: string;
  customerName: string;
  customerGst?: string | null;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  periodStart: string;
  periodEnd: string;
  status: InvoiceStatus;
  downloadUrl?: string;
  pdfGenerated: boolean;
  createdAt: string;
  paidAt?: string | null;
}

export interface SupportTicketDTO {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

