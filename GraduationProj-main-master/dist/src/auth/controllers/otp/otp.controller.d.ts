import { OtpService } from 'src/auth/services/otp/otp.service';
import { RequestOtpDto } from 'src/auth/dtos/request-otp.dto';
import { VerifyOtpDto } from 'src/auth/dtos/verify-otp.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
export declare class OtpController {
    private otpService;
    private authService;
    constructor(otpService: OtpService, authService: AuthService);
    requestOtp(requestOtpDto: RequestOtpDto): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        username: string;
        id: string;
        email: string;
        status: boolean;
        isOAuthUser: boolean;
        access_token: string;
        message: string;
    }>;
    resendOtp(requestOtpDto: RequestOtpDto): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
    }>;
}
