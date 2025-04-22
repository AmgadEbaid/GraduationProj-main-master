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
exports.GoogleController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("../../services/auth/auth.service");
const swagger_1 = require("@nestjs/swagger");
let GoogleController = class GoogleController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleAuth() {
    }
    async googleAuthCallback(req, res) {
        try {
            const userData = req.user;
            const isMobileApp = req.headers['user-agent']?.includes('Flutter');
            if (isMobileApp) {
                const deepLink = `${process.env.FLUTTER_APP_SCHEME}://auth?token=${userData.access_token}&userId=${userData.id}&email=${userData.email}`;
                return res.redirect(deepLink);
            }
            else {
                return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${userData.access_token}&userId=${userData.id}&email=${userData.email}`);
            }
        }
        catch (error) {
            console.error('Error in Google callback:', error);
            return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
        }
    }
};
exports.GoogleController = GoogleController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Google OAuth authentication' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirects to Google authentication page'
    }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GoogleController.prototype, "googleAuth", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Handle Google OAuth callback' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirects to frontend with authentication token'
    }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Get)('callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoogleController.prototype, "googleAuthCallback", null);
exports.GoogleController = GoogleController = __decorate([
    (0, swagger_1.ApiTags)('google-auth'),
    (0, common_1.Controller)('auth/google'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], GoogleController);
//# sourceMappingURL=google.controller.js.map