import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'entities/Product';
import { User } from 'entities/User';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User]), JwtModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
