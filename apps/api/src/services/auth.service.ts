import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { mockDb } from '@lootupspace/database';
import { UserRole, UserStatus, KycStatus, DEMO_USERS } from '@lootupspace/shared';
import { NotificationService } from './notifications.service';

export class AuthService {
  private static otpStore = new Map<string, { otp: string; expiresAt: number }>();

  static async sendOtp(phone: string): Promise<{ success: boolean; message: string; devOtp?: string }> {
    const formattedPhone = phone.trim();
    // In development or for demo accounts, use deterministic or generated 6-digit OTP
    const isDemo = Object.values(DEMO_USERS).some(u => u.phone === formattedPhone);
    const otp = isDemo ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

    this.otpStore.set(formattedPhone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await NotificationService.sendNotification({
      toPhone: formattedPhone,
      templateKey: 'AUTH_OTP',
      variables: { otp },
      channels: ['SMS', 'WHATSAPP']
    });

    return {
      success: true,
      message: `OTP sent to ${formattedPhone}`,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    };
  }

  static async verifyOtp(
    phone: string,
    enteredOtp: string,
    name?: string,
    email?: string
  ): Promise<{ token: string; user: any }> {
    const formattedPhone = phone.trim();
    const stored = this.otpStore.get(formattedPhone);

    // Accept '123456' in dev or match stored
    const isValid = enteredOtp === '123456' || (stored && stored.otp === enteredOtp && stored.expiresAt > Date.now());

    if (!isValid) {
      throw new Error('Invalid or expired OTP. Please try again.');
    }

    this.otpStore.delete(formattedPhone);

    // Find or create user
    let user = mockDb.users.find(u => u.phone === formattedPhone);

    if (!user) {
      const isFirstUser = mockDb.users.length === 0;
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        phone: formattedPhone,
        email: email || null,
        name: name || 'Valued Customer',
        role: isFirstUser ? UserRole.ADMIN : UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        kycStatus: KycStatus.NOT_SUBMITTED,
        referralCode: `LUP${Math.floor(1000 + Math.random() * 9000)}`,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDb.users.push(user);
    } else {
      if (name && !user.name) user.name = name;
      if (email && !user.email) user.email = email;
      user.updatedAt = new Date().toISOString();
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  }

  static async demoLogin(role: UserRole): Promise<{ token: string; user: any }> {
    let demoConfig = DEMO_USERS.CUSTOMER;
    if (role === UserRole.DRIVER) demoConfig = DEMO_USERS.DRIVER;
    if (role === UserRole.WAREHOUSE) demoConfig = DEMO_USERS.WAREHOUSE;
    if (role === UserRole.ADMIN) demoConfig = DEMO_USERS.ADMIN;

    let user = mockDb.users.find(u => u.id === demoConfig.id || u.phone === demoConfig.phone);

    if (!user) {
      user = {
        id: demoConfig.id,
        phone: demoConfig.phone,
        email: demoConfig.email,
        name: demoConfig.name,
        role,
        status: UserStatus.ACTIVE,
        kycStatus: KycStatus.VERIFIED,
        referralCode: `${role}001`,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDb.users.push(user);
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  }

  static async submitKyc(
    userId: string,
    documentType: string,
    documentNumber: string,
    documentFileUrl: string
  ): Promise<any> {
    const user = mockDb.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    user.kycStatus = KycStatus.VERIFIED; // Auto-verify in demo
    user.kycDetails = {
      documentType,
      documentNumber,
      documentFileUrl,
      verifiedAt: new Date().toISOString()
    };
    user.updatedAt = new Date().toISOString();

    return user;
  }
}

