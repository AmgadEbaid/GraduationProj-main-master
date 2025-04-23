import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'entities/Address';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/createAddressDto.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private Address: Repository<Address>,
  ) {}
  async create(createAddressDto: CreateAddressDto, userId) {
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

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  async update(addressId: string, updateAddressDto, userId) {
    const { address } = await this.checkId(addressId, userId);

    await this.Address.update({ id: address.id }, updateAddressDto);

    return {
      status: 'success',
      message: 'address updated successfully',
    };
  }

  async remove(addressId: string, userId) {
    const { address } = await this.checkId(addressId, userId);
    await this.Address.delete({ id: address.id });

    return;
  }
  private async checkId(addressId: string, userId: string) {
    const address = await this.Address.findOne({
      where: { id: addressId },
      relations: ['user'],
      select: ['id', 'user'],
    });

    if (!address || !(address.user.id === userId))
      throw new HttpException('address not found', HttpStatus.NOT_FOUND);
    return { address };
  }
}
