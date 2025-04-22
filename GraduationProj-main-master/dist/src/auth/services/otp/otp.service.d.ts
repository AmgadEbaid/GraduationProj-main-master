import { Repository } from 'typeorm';
import { Otp } from 'entities/Otp';
import { User } from 'entities/User';
import { EmailService } from '../email/email.service';
export declare class OtpService {
    private otpRepository;
    private userRepository;
    private emailService;
    constructor(otpRepository: Repository<Otp>, userRepository: Repository<User>, emailService: EmailService);
    private generateOtp;
    createOtp(email: string): Promise<Otp>;
    verifyOtp(email: string, otpCode: string): Promise<User>;
    resendOtp(email: string): Promise<Otp>;
    isOtpVerified(email: string): Promise<boolean>;
}
