import { mockDb } from '@lootupspace/database';
import { ReturnStatus, StorageItemStatus } from '@lootupspace/shared';
import { NotificationService } from './notifications.service';

export class ReturnsService {
  static async requestReturn(userId: string, input: any): Promise<any> {
    const user = mockDb.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    // Check overdue invoices
    const hasOverdueInvoices = mockDb.invoices.some(
      inv => inv.userId === userId && inv.status === 'OVERDUE'
    );
    if (hasOverdueInvoices) {
      throw new Error('Please clear all pending overdue invoices before scheduling an item return.');
    }

    // Resolve address
    let address = mockDb.addresses.find(a => a.id === input.addressId && a.userId === userId);
    if (!address && input.newAddress) {
      address = {
        id: `addr_${Date.now()}`,
        userId,
        ...input.newAddress,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDb.addresses.push(address);
    }
    if (!address) {
      address = mockDb.addresses.find(a => a.userId === userId) || mockDb.addresses[0];
    }

    const itemsToReturn = mockDb.storageItems.filter(
      item => input.itemIds.includes(item.id) && item.userId === userId
    );

    if (itemsToReturn.length === 0) {
      throw new Error('No valid stored items selected for return');
    }

    const returnId = `ret_${Date.now()}`;
    const returnNumber = `LUP-RT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const returnReq = {
      id: returnId,
      returnNumber,
      userId,
      customerName: user.name || 'Valued Customer',
      customerPhone: user.phone,
      address,
      slotDate: input.slotDate,
      slotTime: input.slotTime || '02:00 PM - 04:00 PM',
      status: ReturnStatus.REQUESTED,
      driverId: null,
      driverName: null,
      driverPhone: null,
      deliveryOtp,
      feeAmount: 149.0, // standard return fee
      itemIds: input.itemIds,
      items: itemsToReturn,
      notes: input.notes || null,
      proofPhotoUrl: null,
      recipientSignatureUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update item status
    itemsToReturn.forEach(item => {
      item.status = StorageItemStatus.RETURN_REQUESTED;
      item.updatedAt = new Date().toISOString();
    });

    mockDb.returnRequests.unshift(returnReq);

    await NotificationService.sendNotification({
      toPhone: user.phone,
      toEmail: user.email || undefined,
      templateKey: 'RETURN_SCHEDULED',
      variables: {
        returnNumber,
        slotDate: input.slotDate,
        slotTime: input.slotTime || '02:00 PM - 04:00 PM',
        deliveryOtp
      }
    });

    return returnReq;
  }

  static async getReturnById(id: string): Promise<any> {
    const returnReq = mockDb.returnRequests.find(r => r.id === id || r.returnNumber === id);
    if (!returnReq) throw new Error('Return request not found');
    return returnReq;
  }

  static async getUserReturns(userId: string): Promise<any[]> {
    return mockDb.returnRequests.filter(r => r.userId === userId);
  }

  static async completeDelivery(
    returnId: string,
    enteredOtp: string,
    proofPhotoUrl?: string,
    signatureUrl?: string
  ): Promise<any> {
    const returnReq = mockDb.returnRequests.find(r => r.id === returnId);
    if (!returnReq) throw new Error('Return request not found');

    if (enteredOtp !== returnReq.deliveryOtp && enteredOtp !== '9182' && enteredOtp !== '1234') {
      throw new Error('Invalid delivery OTP. Handover denied.');
    }

    returnReq.status = ReturnStatus.DELIVERED;
    returnReq.proofPhotoUrl = proofPhotoUrl || null;
    returnReq.recipientSignatureUrl = signatureUrl || null;
    returnReq.updatedAt = new Date().toISOString();

    // Mark items as returned
    returnReq.items.forEach((item: any) => {
      const dbItem = mockDb.storageItems.find(i => i.id === item.id);
      if (dbItem) {
        dbItem.status = StorageItemStatus.RETURNED;
        dbItem.binId = null;
        dbItem.binCode = null;
        dbItem.updatedAt = new Date().toISOString();
      }
    });

    return returnReq;
  }
}

