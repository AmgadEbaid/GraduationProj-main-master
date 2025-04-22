import { JwtService } from '@nestjs/jwt';
import { User } from 'entities/User';
import { createUser } from 'src/user/dtos/createUser.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { OtpService } from '../otp/otp.service';
interface GoogleUser {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken?: string;
}
export declare class AuthService {
    private User;
    private jwtService;
    private userservice;
    private otpService;
    constructor(User: Repository<User>, jwtService: JwtService, userservice: UserService, otpService: OtpService);
    signUp(user: createUser): Promise<User>;
    login(user: User): Promise<{
        username: string;
        id: string;
        email: string;
        status: boolean;
        isOAuthUser: boolean;
        access_token: string;
    }>;
    validateUser(loginDto: LoginDto): Promise<User>;
    forgotPassword(email: string): Promise<import("../../../../entities/Otp").Otp>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<User>;
    googleLogin(googleUser: GoogleUser): Promise<{
        username: string;
        id: string;
        email: string;
        status: boolean;
        isOAuthUser: boolean;
        access_token: string;
    }>;
}
export {};
