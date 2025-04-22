import { createUser } from 'src/user/dtos/createUser.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { OtpService } from 'src/auth/services/otp/otp.service';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { ForgotPasswordDto } from 'src/auth/dtos/forgot-password.dto';
import { ResetPasswordDto } from 'src/auth/dtos/reset-password.dto';
export declare class AuthController {
    private authservice;
    private otpService;
    constructor(authservice: AuthService, otpService: OtpService);
    signup(User: createUser): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
        accountStatus: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        username: string;
        id: string;
        email: string;
        status: boolean;
        isOAuthUser: boolean;
        access_token: string;
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            status: boolean;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
        email: string;
    }>;
}
