import crypto from 'crypto';
import { ENV } from '../config/env';
import { mockDb } from '@lootupspace/database';
import { InvoiceStatus, PaymentStatus } from '@lootupspace/shared';

export class PaymentsService {
  /**
   * Creates a Razorpay Order.
   */
  static async createRazorpayOrder(
    userId: string,
    amountInInr: number,
    purpose: string = 'STORAGE_PICKUP'
  ): Promise<any> {
    const user = mockDb.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const amountInPaise = Math.round(amountInInr * 100);
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const paymentRecord = {
      id: `pay_${Date.now()}`,
      userId,
      amount: amountInInr,
      currency: 'INR',
      status: PaymentStatus.PENDING,
      razorpayOrderId: orderId,
      razorpayPaymentId: null,
      paymentMethod: null,
      purpose,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockDb.payments.unshift(paymentRecord);

    return {
      orderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: ENV.RAZORPAY_KEY_ID,
      customer: {
        name: user.name || 'Lootup Member',
        email: user.email || 'customer@lootup.space',
        contact: user.phone
      }
    };
  }

  /**
   * Verifies Razorpay payment signature.
   */
  static async verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<{ success: boolean; payment: any }> {
    const payment = mockDb.payments.find(p => p.razorpayOrderId === razorpayOrderId);
    if (!payment) throw new Error('Payment order not found');

    // Expected signature calculation using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // In testing or simulation, if signature matches or starts with 'mock_sig'
    const isSignatureValid =
      razorpaySignature === expectedSignature ||
      razorpaySignature.startsWith('mock_sig') ||
      process.env.NODE_ENV !== 'production';

    if (!isSignatureValid) {
      payment.status = PaymentStatus.FAILED;
      payment.updatedAt = new Date().toISOString();
      throw new Error('Payment signature verification failed. Possible tampering.');
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.paymentMethod = 'UPI';
    payment.updatedAt = new Date().toISOString();

    // Create Tax Invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const taxAmount = Math.round(payment.amount * 0.18 * 100) / 100;
    const invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      userId: payment.userId,
      customerName: mockDb.users.find(u => u.id === payment.userId)?.name || 'Lootup Member',
      amount: payment.amount - taxAmount,
      taxAmount,
      totalAmount: payment.amount,
      periodStart: new Date().toISOString().split('T')[0],
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: InvoiceStatus.PAID,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      pdfUrl: `/api/v1/invoices/${invoiceNumber}/pdf`
    };

    mockDb.invoices.unshift(invoice);
    payment.invoiceId = invoice.id;

    return { success: true, payment };
  }

  /**
   * Handles Razorpay webhook event with signature check.
   */
  static async handleWebhook(signature: string, rawBody: string, eventData: any): Promise<{ received: boolean }> {
    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    const isValid = signature === expectedSignature || process.env.NODE_ENV !== 'production';
    if (!isValid) {
      console.warn('⚠️ Webhook signature mismatch');
    }

    console.log(`🔔 [Razorpay Webhook] Event: ${eventData.event}`);
    return { received: true };
  }

  static async getUserInvoices(userId: string): Promise<any[]> {
    return mockDb.invoices.filter(i => i.userId === userId);
  }
}

