import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from 'entities/Otp';
import { User } from 'entities/User';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  /**
   * Generates a random 6-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Creates and saves a new OTP for the given email
   * @param email The email to create an OTP for
   * @returns The created OTP entity
   */
  async createOtp(email: string): Promise<Otp> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate OTP
    const otpCode = this.generateOtp();

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing OTPs for this email
    await this.otpRepository.delete({ email: email });

    // Create new OTP
    const otp = this.otpRepository.create({
      email,
      otp: otpCode,
      expiresAt,
      isVerified: false,
    });

    await this.otpRepository.save(otp);

    // Send OTP via email
    await this.emailService.sendOtpEmail(email, otpCode);

    return otp;
  }

  /**
   * Verifies an OTP for a given email
   * @param email The email to verify the OTP for
   * @param otpCode The OTP code to verify
   * @returns The verified OTP entity
   */
  async verifyOtp(email: string, otpCode: string) {
    const otp = await this.otpRepository.findOne({
      where: { email: email, otp: otpCode },
    });

    if (!otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    // Check if OTP is expired
    if (new Date() > otp.expiresAt) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    // Mark OTP as verified
    otp.isVerified = true;
    await this.otpRepository.save(otp);

    // Update user status if needed
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user && !user.status) {
      user.status = true;
      await this.userRepository.save(user);
    }

    return user;
  }

  /**
   * Resends an OTP for a given email
   * @param email The email to resend the OTP for
   * @returns The new OTP entity
   */
  async resendOtp(email: string): Promise<Otp> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if there's an existing OTP and it was created less than 1 minute ago
    const existingOtp = await this.otpRepository.findOne({
      where: { email: email },
      order: { createdAt: 'DESC' },
    });

    if (existingOtp) {
      const oneMinuteAgo = new Date();
      oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

      if (existingOtp.createdAt > oneMinuteAgo) {
        throw new BadRequestException(
          'Please wait before requesting a new OTP',
        );
      }
    }

    // Create a new OTP
    return this.createOtp(email);
  }

  /**
   * Validates if a user has a verified OTP
   * @param email The email to check
   * @returns True if the user has a verified OTP
   */
  async isOtpVerified(email: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: { email: email, isVerified: true },
      order: { createdAt: 'DESC' },
    });

    return !!otp;
  }
}
