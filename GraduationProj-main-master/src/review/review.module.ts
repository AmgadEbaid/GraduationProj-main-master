import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { Product } from 'entities/Product';
import { JwtModule } from '@nestjs/jwt';
import { Review } from 'entities/review';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Review]), JwtModule],
  controllers: [ReviewController],
  providers: [ReviewService],

  exports: [ReviewService],
})
export class ReviewModule {}
