import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'entities/Address';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), JwtModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
