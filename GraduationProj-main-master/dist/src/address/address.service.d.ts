import { Address } from 'entities/Address';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/createAddressDto.dto';
export declare class AddressService {
    private Address;
    constructor(Address: Repository<Address>);
    create(createAddressDto: CreateAddressDto, userId: any): Promise<{
        status: string;
        message: string;
        savedAddress: Address;
    }>;
    getAll(userId: any): Promise<{
        addresses: Address[];
    }>;
    findOne(id: number): string;
    update(addressId: string, updateAddressDto: any, userId: any): Promise<{
        status: string;
        message: string;
    }>;
    remove(addressId: string, userId: any): Promise<void>;
    private checkId;
}
