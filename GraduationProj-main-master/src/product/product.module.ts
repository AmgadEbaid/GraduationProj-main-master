import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'entities/Product';
import { User } from 'entities/User';
import { JwtModule } from '@nestjs/jwt';
import { SearchHistory } from 'entities/SearchHistory';
import { SearchHistoryService } from 'src/search-history/search-history.service';
import { SearchHistoryModule } from 'src/search-history/search-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, SearchHistory]),
    JwtModule,
    SearchHistoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, SearchHistoryService],
})
export class ProductModule {}
