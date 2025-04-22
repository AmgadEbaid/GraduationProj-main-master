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
exports.OtpController = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("../../services/otp/otp.service");
const request_otp_dto_1 = require("../../dtos/request-otp.dto");
const verify_otp_dto_1 = require("../../dtos/verify-otp.dto");
const auth_service_1 = require("../../services/auth/auth.service");
const swagger_1 = require("@nestjs/swagger");
let OtpController = class OtpController {
    constructor(otpService, authService) {
        this.otpService = otpService;
        this.authService = authService;
    }
    async requestOtp(requestOtpDto) {
        const otp = await this.otpService.createOtp(requestOtpDto.email);
        return {
            message: 'OTP sent successfully to your email',
            email: otp.email,
            expiresAt: otp.expiresAt,
        };
    }
    async verifyOtp(verifyOtpDto) {
        const user = await this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
        const authResult = await this.authService.login(user);
        return {
            message: 'OTP verified successfully',
            ...authResult
        };
    }
    async resendOtp(requestOtpDto) {
        const otp = await this.otpService.resendOtp(requestOtpDto.email);
        return {
            message: 'OTP resent successfully to your email',
            email: otp.email,
            expiresAt: otp.expiresAt,
        };
    }
};
exports.OtpController = OtpController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Request a new OTP' }),
    (0, swagger_1.ApiBody)({ type: request_otp_dto_1.RequestOtpDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'OTP sent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'OTP sent successfully to your email' },
                email: { type: 'string', example: 'user@example.com' },
                expiresAt: { type: 'string', format: 'date-time', example: '2025-03-15T16:20:00.000Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid email' }),
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_otp_dto_1.RequestOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "requestOtp", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify an OTP' }),
    (0, swagger_1.ApiBody)({ type: verify_otp_dto_1.VerifyOtpDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP verified successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'OTP verified successfully' },
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid or expired OTP' }),
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "verifyOtp", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Resend an OTP' }),
    (0, swagger_1.ApiBody)({ type: request_otp_dto_1.RequestOtpDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP resent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'OTP resent successfully to your email' },
                email: { type: 'string', example: 'user@example.com' },
                expiresAt: { type: 'string', format: 'date-time', example: '2025-03-15T16:20:00.000Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid email or too many requests' }),
    (0, common_1.Post)('resend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_otp_dto_1.RequestOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "resendOtp", null);
exports.OtpController = OtpController = __decorate([
    (0, swagger_1.ApiTags)('otp'),
    (0, common_1.Controller)('auth/otp'),
    __metadata("design:paramtypes", [otp_service_1.OtpService, auth_service_1.AuthService])
], OtpController);
//# sourceMappingURL=otp.controller.js.map