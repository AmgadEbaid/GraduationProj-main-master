import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'entities/Delivery';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'entities/User';
import { Product } from 'entities/Product';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, User, Product]), JwtModule],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
