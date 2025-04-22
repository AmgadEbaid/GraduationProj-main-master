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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class createUser {
}
exports.createUser = createUser;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User name (4-20 characters)',
        example: 'amgad',
        minLength: 4,
        maxLength: 20,
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], createUser.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'amgadabdo@gmail.com',
        required: true,
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], createUser.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password (min 6 characters, must include uppercase, lowercase, number, and special character)',
        example: '13123Arc@12e',
        required: true,
        minLength: 6,
    }),
    (0, class_validator_1.MinLength)(6, {
        message: 'Password must be at least 6 characters long',
    }),
    (0, class_validator_1.Matches)(/(?=.*\d)/, {
        message: 'Password must contain at least 1 number',
    }),
    (0, class_validator_1.Matches)(/(?=.*[A-Z])/, {
        message: 'Password must contain at least 1 uppercase letter',
    }),
    (0, class_validator_1.Matches)(/(?=.*[a-z])/, {
        message: 'Password must contain at least 1 lowercase letter',
    }),
    (0, class_validator_1.Matches)(/(?=.*[!@#$%^&*()_+])/, {
        message: 'Password must contain at least 1 special character',
    }),
    __metadata("design:type", String)
], createUser.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User phone number',
        example: '12341353214',
        required: true,
    }),
    (0, class_validator_1.IsPhoneNumber)('EG'),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createUser.prototype, "phone", void 0);
//# sourceMappingURL=createUser.dto.js.map