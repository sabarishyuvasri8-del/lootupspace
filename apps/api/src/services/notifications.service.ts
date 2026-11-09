export interface SendNotificationPayload {
  toPhone?: string;
  toEmail?: string;
  templateKey: string;
  variables: Record<string, string | number>;
  channels?: ('SMS' | 'WHATSAPP' | 'EMAIL')[];
}

export class NotificationService {
  private static templates: Record<string, { sms: string; wa: string; emailSubject: string; emailBody: string }> = {
    AUTH_OTP: {
      sms: 'Your Lootupspace verification code is {otp}. Valid for 10 minutes. Do not share with anyone.',
      wa: '🔐 *Lootupspace Verification Code*\n\nYour OTP is: *{otp}*\n\nUse this to sign in securely to your personal storage vault. Valid for 10 minutes.',
      emailSubject: 'Your Lootupspace Login OTP: {otp}',
      emailBody: '<p>Hi there,</p><p>Your login OTP for Lootupspace is <strong>{otp}</strong>. It expires in 10 minutes.</p>'
    },
    BOOKING_CONFIRMED: {
      sms: 'Lootupspace: Your pickup booking #{bookingNumber} is confirmed for {slotDate} ({slotTime}). Our driver will arrive on time.',
      wa: '📦 *Pickup Confirmed! - Lootupspace*\n\nBooking ID: *{bookingNumber}*\nDate: *{slotDate}*\nSlot: *{slotTime}*\nAddress: {address}\n\nOur verified pickup team will arrive with packing materials. Track live in your app.',
      emailSubject: 'Pickup Confirmed: #{bookingNumber} - Lootupspace',
      emailBody: '<h2>Pickup Confirmed!</h2><p>Your pickup <strong>#{bookingNumber}</strong> is scheduled for {slotDate} between {slotTime}.</p>'
    },
    DRIVER_ASSIGNED: {
      sms: 'Lootupspace: Driver {driverName} ({driverVehicle}) has been assigned to your pickup #{bookingNumber}. Call: {driverPhone}',
      wa: '🚚 *Driver Assigned - Lootupspace*\n\nYour pickup lead is *{driverName}*\nVehicle: *{driverVehicle}*\nContact: {driverPhone}\nHandover OTP: *{pickupOtp}*\n\nShare this OTP only when your items are verified into our vehicle.',
      emailSubject: 'Driver Assigned for Pickup #{bookingNumber}',
      emailBody: '<p>Driver <strong>{driverName}</strong> has been assigned to your booking #{bookingNumber}.</p>'
    },
    DRIVER_ON_THE_WAY: {
      sms: 'Lootupspace: Driver {driverName} is on the way to your address! ETA: {etaMinutes} mins. Handover OTP: {pickupOtp}',
      wa: '📍 *Driver On The Way!*\n\n{driverName} is arriving in ~{etaMinutes} minutes.\nPlease keep your items ready. Share Handover OTP *{pickupOtp}* with the driver.',
      emailSubject: 'Driver {driverName} is on the way to your pickup',
      emailBody: '<p>{driverName} is arriving in approximately {etaMinutes} minutes.</p>'
    },
    PICKUP_COMPLETED: {
      sms: 'Lootupspace: Handover confirmed! {itemCount} items safely collected and in transit to our secure warehouse.',
      wa: '✅ *Pickup Completed Successfully!*\n\nWe have received *{itemCount} items*. They are sealed with security barcoding and on their way to our humidity-controlled hub.',
      emailSubject: 'Pickup Handover Complete - #{bookingNumber}',
      emailBody: '<p>Thank you! Your items have been collected and are en route to our storage hub.</p>'
    },
    ITEMS_STORED: {
      sms: 'Lootupspace: Your items are safely stored! View your digital inventory with photos and QR codes in the app.',
      wa: '🏢 *Items Safely Shelved & Insured!*\n\nAll items from booking #{bookingNumber} have completed intake inspection, barcoding, and are locked in your assigned vault rack. Check your digital inventory anytime!',
      emailSubject: 'Your Items are Safely Stored in our Warehouse Hub',
      emailBody: '<p>Your items have been safely shelved, photographed, and tagged with unique QR codes.</p>'
    },
    INVOICE_GENERATED: {
      sms: 'Lootupspace: Tax invoice #{invoiceNumber} for ₹{amount} has been generated. View/download in your dashboard.',
      wa: '🧾 *Monthly Storage Invoice Generated*\n\nInvoice: *#{invoiceNumber}*\nAmount Due: *₹{amount}* (incl. 18% GST)\nDue Date: *{dueDate}*\n\nTap to pay or view breakdown in app.',
      emailSubject: 'Tax Invoice #{invoiceNumber} - Lootupspace',
      emailBody: '<p>Your monthly storage invoice #{invoiceNumber} for ₹{amount} is ready.</p>'
    },
    RETURN_SCHEDULED: {
      sms: 'Lootupspace: Return delivery #{returnNumber} is scheduled for {slotDate}. Delivery OTP is {deliveryOtp}.',
      wa: '🎁 *Return Delivery Scheduled!*\n\nOrder: *#{returnNumber}*\nDate: *{slotDate}*\nSlot: *{slotTime}*\nDelivery OTP: *{deliveryOtp}*\n\nOur team will bring your items directly to your doorstep.',
      emailSubject: 'Return Delivery Scheduled: #{returnNumber}',
      emailBody: '<p>Your return delivery #{returnNumber} has been scheduled.</p>'
    }
  };

  static async sendNotification(payload: SendNotificationPayload): Promise<{ success: boolean; dispatchedTo: string[] }> {
    const template = this.templates[payload.templateKey];
    const dispatchedTo: string[] = [];

    let smsText = template?.sms || 'Lootupspace Notification';
    let waText = template?.wa || 'Lootupspace Notification';
    let emailSubject = template?.emailSubject || 'Lootupspace Notification';
    let emailBody = template?.emailBody || '<p>Lootupspace Notification</p>';

    for (const [key, val] of Object.entries(payload.variables)) {
      const placeholder = `{${key}}`;
      smsText = smsText.split(placeholder).join(String(val));
      waText = waText.split(placeholder).join(String(val));
      emailSubject = emailSubject.split(placeholder).join(String(val));
      emailBody = emailBody.split(placeholder).join(String(val));
    }

    // Dispatch logging (Simulates SMS, WhatsApp Business API, and Email SendGrid)
    if (payload.toPhone) {
      console.log(`📱 [SMS/WhatsApp -> ${payload.toPhone}]:\n${waText}\n`);
      dispatchedTo.push(`SMS/WA:${payload.toPhone}`);
    }

    if (payload.toEmail) {
      console.log(`📧 [Email -> ${payload.toEmail}] Subject: ${emailSubject}`);
      dispatchedTo.push(`Email:${payload.toEmail}`);
    }

    return {
      success: true,
      dispatchedTo
    };
  }
}

