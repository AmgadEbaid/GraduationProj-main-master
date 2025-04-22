import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/createAddressDto.dto';
import { Request } from 'express';
import { UpdateAddressDto } from './dto/updateAddressDto.dto';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    create(req: Request, createAddressDto: CreateAddressDto): Promise<{
        status: string;
        message: string;
        savedAddress: import("../../entities/Address").Address;
    }>;
    getAll(req: Request): Promise<{
        addresses: import("../../entities/Address").Address[];
    }>;
    update(req: Request, id: string, updateAddressDto: UpdateAddressDto): Promise<{
        status: string;
        message: string;
    }>;
    remove(req: Request, id: string): Promise<void>;
}
