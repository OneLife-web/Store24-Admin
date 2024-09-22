import crypto from 'crypto';
import { OTP } from '@/utils/models/OTP';
import { User } from '@/utils/models/User';
import { sendOTPViaEmail } from '@/utils/emailService';

const OTP_EXPIRATION_MINUTES = 10;

export async function generateOTP(phone: string) {
  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Calculate OTP expiration time
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRATION_MINUTES);

  // Save OTP to the database
  await OTP.create({
    phone,
    otp,
    expiresAt,
  });

  // Send OTP via email or SMS (adapt to your use case)
  await sendOTPViaEmail(phone, otp);

  return { success: true, message: 'OTP sent successfully' };
}

export async function verifyOTP(phone: string, otp: string) {
  // Find the OTP record in the database
  const otpRecord = await OTP.findOne({ phone });

  if (!otpRecord) {
    return { success: false, message: 'OTP not found' };
  }

  // Check if the OTP is expired
  const now = new Date();
  if (otpRecord.expiresAt < now) {
    return { success: false, message: 'OTP expired' };
  }

  // Validate the OTP
  if (otpRecord.otp !== otp) {
    return { success: false, message: 'Invalid OTP' };
  }

  // Optionally, find or create the user
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      // Add other user details if needed
    });
  }

  // Optionally, generate a JWT or session token
  const token = 'dummy-jwt-token'; // Replace with actual JWT generation

  return { success: true, message: 'OTP verified', user, token };
}