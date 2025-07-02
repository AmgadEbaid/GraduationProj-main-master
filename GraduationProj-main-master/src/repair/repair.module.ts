import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repair } from 'entities/Repair';
import { User } from 'entities/User';
import { Product } from 'entities/Product';
import { JwtModule } from '@nestjs/jwt';
import { Delivery } from 'entities/Delivery';

@Module({
  imports: [TypeOrmModule.forFeature([Repair, User, Product, Delivery]), JwtModule],
  providers: [RepairService],
  controllers: [RepairController]
})
export class RepairModule {}
