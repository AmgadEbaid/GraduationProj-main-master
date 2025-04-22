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
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let TestController = class TestController {
    getPublicData() {
        return {
            message: 'This is public data that anyone can access',
            timestamp: new Date().toISOString(),
        };
    }
    getProtectedData(request) {
        const user = request['user'];
        return {
            message: 'This is protected data that only authenticated users can access',
            user: {
                id: user.sub,
                username: user.username,
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.TestController = TestController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get public data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns public data that anyone can access',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'This is public data that anyone can access' },
                timestamp: { type: 'string', example: '2025-03-15T15:20:00.000Z' }
            }
        }
    }),
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "getPublicData", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get protected data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns protected data that only authenticated users can access',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'This is protected data that only authenticated users can access' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'c620ff1a-aeb5-4d52-b15e-f6d2e5e16f5c' },
                        username: { type: 'string', example: 'amjad Ebaid' }
                    }
                },
                timestamp: { type: 'string', example: '2025-03-15T15:20:00.000Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('protected'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestController.prototype, "getProtectedData", null);
exports.TestController = TestController = __decorate([
    (0, swagger_1.ApiTags)('test'),
    (0, common_1.Controller)('test')
], TestController);
//# sourceMappingURL=test.controller.js.map