"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const createUser_dto_1 = require("../../../user/dtos/createUser.dto");
const auth_service_1 = require("../../services/auth/auth.service");
const otp_service_1 = require("../../services/otp/otp.service");
const login_dto_1 = require("../../dtos/login.dto");
const forgot_password_dto_1 = require("../../dtos/forgot-password.dto");
const reset_password_dto_1 = require("../../dtos/reset-password.dto");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authservice, otpService) {
        this.authservice = authservice;
        this.otpService = otpService;
    }
    async signup(User) {
        const signupUser = await this.authservice.signUp(User);
        const otp = await this.otpService.createOtp(signupUser.email);
        return {
            message: 'Account created successfully. OTP sent to your email for verification.',
            email: otp.email,
            expiresAt: otp.expiresAt,
            accountStatus: 'pending_verification',
        };
    }
    async login(loginDto) {
        const user = await this.authservice.validateUser(loginDto);
        const authResult = await this.authservice.login(user);
        return {
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                status: user.status,
            },
            ...authResult,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const otp = await this.authservice.forgotPassword(forgotPasswordDto.email);
        return {
            message: 'Password reset OTP sent to your email',
            email: otp.email,
            expiresAt: otp.expiresAt,
        };
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.authservice.resetPassword(resetPasswordDto.email, resetPasswordDto.otp, resetPasswordDto.newPassword);
        return {
            message: 'Password reset successful',
            email: user.email,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiBody)({ type: createUser_dto_1.createUser }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully and OTP sent',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Account created successfully. OTP sent to your email for verification.',
                },
                email: { type: 'string', example: 'user@example.com' },
                expiresAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-03-15T16:20:00.000Z',
                },
                accountStatus: { type: 'string', example: 'pending_verification' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data' }),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.createUser]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Login successful' },
                user: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: 'c620ff1a-aeb5-4d52-b15e-f6d2e5e16f5c',
                        },
                        email: { type: 'string', example: 'user@example.com' },
                        name: { type: 'string', example: 'John Doe' },
                        status: { type: 'string', example: 'active' },
                    },
                },
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset OTP' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset OTP sent',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Password reset OTP sent to your email',
                },
                email: { type: 'string', example: 'user@example.com' },
                expiresAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-03-15T16:20:00.000Z',
                },
            },
        },
    }),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using OTP' }),
    (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Password reset successful' },
                email: { type: 'string', example: 'user@example.com' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid OTP or expired OTP',
    }),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        otp_service_1.OtpService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map