// utils/emailService.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendOTPViaEmail(to: string, otp: string) {
  const msg = {
    to, // recipient email address or phone number if using email-to-SMS
    from: 'your-email@example.com', // your verified SendGrid sender email
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
    html: `<strong>Your OTP code is ${otp}</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}
