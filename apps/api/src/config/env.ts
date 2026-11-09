import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://lootup:lootup123@localhost:5432/lootupspace?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'lootupspace_jwt_super_secure_secret_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_lootup_mock_key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_998877',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_whsec_lootup_mock',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  S3_BUCKET: process.env.S3_BUCKET || 'lootup-storage-assets',
  S3_ENDPOINT: process.env.S3_ENDPOINT || 'https://s3.ap-south-1.amazonaws.com',
  TWILIO_OR_MSG91_KEY: process.env.SMS_API_KEY || 'stub_sms_key_msg91',
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || 'stub_wa_token',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'stub_sendgrid_key',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'stub_gmaps_key'
};

