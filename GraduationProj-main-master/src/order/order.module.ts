import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from 'entities/Order';
import { Product } from 'entities/Product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'entities/User';
import { Delivery } from 'entities/Delivery';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order, Product,User,Delivery]), JwtModule],
})
export class OrderModule {}
