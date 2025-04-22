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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../../../../entities/User");
const bcrypt = require("bcrypt");
const user_service_1 = require("../../../user/user.service");
const typeorm_2 = require("typeorm");
const otp_service_1 = require("../otp/otp.service");
let AuthService = class AuthService {
    constructor(User, jwtService, userservice, otpService) {
        this.User = User;
        this.jwtService = jwtService;
        this.userservice = userservice;
        this.otpService = otpService;
    }
    async signUp(user) {
        const users = await this.userservice.find(user.email);
        if (users.length) {
            throw new common_1.BadRequestException('email is already used');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        return this.userservice.create(user);
    }
    async login(user) {
        const payload = { username: user.name, sub: user.id };
        return {
            username: user.name,
            id: user.id,
            email: user.email,
            status: user.status,
            isOAuthUser: user.isOAuthUser,
            access_token: this.jwtService.sign(payload, {
                expiresIn: '1d',
            }),
        };
    }
    async validateUser(loginDto) {
        const user = await this.User.findOne({
            where: { email: loginDto.email },
            select: [
                'id',
                'email',
                'password',
                'name',
                'status',
                'phone',
                'isOAuthUser',
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.isOAuthUser) {
            throw new common_1.UnauthorizedException('This account uses Google Sign-In. Please sign in with Google.');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.status) {
            throw new common_1.UnauthorizedException('Email not verified. Please verify your email first.');
        }
        delete user.password;
        return user;
    }
    async forgotPassword(email) {
        const user = await this.User.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isOAuthUser) {
            throw new common_1.BadRequestException('This account uses Google Sign-In. Password reset is not available.');
        }
        return this.otpService.createOtp(email);
    }
    async resetPassword(email, otp, newPassword) {
        const user = await this.otpService.verifyOtp(email, otp);
        if (user.isOAuthUser) {
            throw new common_1.BadRequestException('This account uses Google Sign-In. Password reset is not available.');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.User.save(user);
        delete user.password;
        return user;
    }
    async googleLogin(googleUser) {
        let user = await this.User.findOne({
            where: { email: googleUser.email },
            select: [
                'id',
                'email',
                'name',
                'status',
                'phone',
                'isOAuthUser',
                'password',
            ],
        });
        if (!user) {
            const newUser = this.User.create({
                email: googleUser.email,
                name: `${googleUser.firstName} ${googleUser.lastName}`,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                status: true,
                phone: '',
                isOAuthUser: true,
            });
            user = await this.User.save(newUser);
        }
        else {
            if (!user.isOAuthUser) {
                throw new common_1.ConflictException('This email is already registered with password authentication. Please use password login.');
            }
            if (!user.status) {
                user.status = true;
                await this.User.save(user);
            }
        }
        delete user.password;
        return this.login(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        user_service_1.UserService,
        otp_service_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map