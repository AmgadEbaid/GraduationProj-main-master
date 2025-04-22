"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./services/auth/auth.service");
const auth_controller_1 = require("./controllers/auth/auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../../entities/User");
const passport_1 = require("@nestjs/passport");
const user_service_1 = require("../user/user.service");
const user_module_1 = require("../user/user.module");
const jwt_1 = require("@nestjs/jwt");
const otp_service_1 = require("./services/otp/otp.service");
const otp_controller_1 = require("./controllers/otp/otp.controller");
const Otp_1 = require("../../entities/Otp");
const email_service_1 = require("./services/email/email.service");
const google_strategy_1 = require("./strategies/google.strategy");
const google_controller_1 = require("./controllers/google/google.controller");
const test_controller_1 = require("./controllers/test/test.controller");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([User_1.User, Otp_1.Otp]),
            jwt_1.JwtModule.register({
                secret: process.env.jwt_secret,
                signOptions: { expiresIn: '1d' },
            }),
            passport_1.PassportModule.register({ session: true }),
            user_module_1.UserModule
        ],
        providers: [auth_service_1.AuthService, user_service_1.UserService, otp_service_1.OtpService, email_service_1.EmailService, google_strategy_1.GoogleStrategy, jwt_auth_guard_1.JwtAuthGuard],
        controllers: [auth_controller_1.AuthController, otp_controller_1.OtpController, google_controller_1.GoogleController, test_controller_1.TestController],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map