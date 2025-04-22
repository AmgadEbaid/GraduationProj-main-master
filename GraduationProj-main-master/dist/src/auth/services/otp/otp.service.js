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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Otp_1 = require("../../../../entities/Otp");
const User_1 = require("../../../../entities/User");
const email_service_1 = require("../email/email.service");
let OtpService = class OtpService {
    constructor(otpRepository, userRepository, emailService) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async createOtp(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otpCode = this.generateOtp();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.otpRepository.delete({ email: email });
        const otp = this.otpRepository.create({
            email,
            otp: otpCode,
            expiresAt,
            isVerified: false,
        });
        await this.otpRepository.save(otp);
        await this.emailService.sendOtpEmail(email, otpCode);
        return otp;
    }
    async verifyOtp(email, otpCode) {
        const otp = await this.otpRepository.findOne({
            where: { email: email, otp: otpCode }
        });
        if (!otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (new Date() > otp.expiresAt) {
            throw new common_1.BadRequestException('OTP expired');
        }
        otp.isVerified = true;
        await this.otpRepository.save(otp);
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (user && !user.status) {
            user.status = true;
            await this.userRepository.save(user);
        }
        return user;
    }
    async resendOtp(email) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingOtp = await this.otpRepository.findOne({
            where: { email: email },
            order: { createdAt: 'DESC' }
        });
        if (existingOtp) {
            const oneMinuteAgo = new Date();
            oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
            if (existingOtp.createdAt > oneMinuteAgo) {
                throw new common_1.BadRequestException('Please wait before requesting a new OTP');
            }
        }
        return this.createOtp(email);
    }
    async isOtpVerified(email) {
        const otp = await this.otpRepository.findOne({
            where: { email: email, isVerified: true },
            order: { createdAt: 'DESC' }
        });
        return !!otp;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Otp_1.Otp)),
    __param(1, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], OtpService);
//# sourceMappingURL=otp.service.js.map