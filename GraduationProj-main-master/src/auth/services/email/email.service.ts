import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Initialize the email transporter
    // Note: In a production environment, you should use environment variables for these settings
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password',
      },
    });
  }

  /**
   * Sends an OTP to the specified email
   * @param email The recipient's email address
   * @param otp The OTP to send
   * @returns A promise that resolves when the email is sent
   */
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Your App <your-email@gmail.com>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p style="color: #666; font-size: 16px;">Hello,</p>
          <p style="color: #666; font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 16px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 16px;">If you didn't request this code, please ignore this email.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">This is an automated email, please do not reply.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
} 