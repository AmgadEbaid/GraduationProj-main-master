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
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Address_1 = require("../../entities/Address");
const typeorm_2 = require("typeorm");
let AddressService = class AddressService {
    constructor(Address) {
        this.Address = Address;
    }
    async create(createAddressDto, userId) {
        const address = this.Address.create({
            ...createAddressDto,
            user: { id: userId },
        });
        const savedAddress = await this.Address.save(address);
        return {
            status: 'success',
            message: 'address created successfully',
            savedAddress,
        };
    }
    async getAll(userId) {
        const addresses = await this.Address.find({
            where: { user: { id: userId } },
        });
        return { addresses };
    }
    findOne(id) {
        return `This action returns a #${id} address`;
    }
    async update(addressId, updateAddressDto, userId) {
        const { address } = await this.checkId(addressId, userId);
        await this.Address.update({ id: address.id }, updateAddressDto);
        return {
            status: 'success',
            message: 'address updated successfully',
        };
    }
    async remove(addressId, userId) {
        const { address } = await this.checkId(addressId, userId);
        await this.Address.delete({ id: address.id });
        return;
    }
    async checkId(addressId, userId) {
        const address = await this.Address.findOne({
            where: { id: addressId },
            relations: ['user'],
            select: ['id', 'user'],
        });
        if (!address || !(address.user.id === userId))
            throw new common_1.HttpException('address not found', common_1.HttpStatus.NOT_FOUND);
        return { address };
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Address_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddressService);
//# sourceMappingURL=address.service.js.map