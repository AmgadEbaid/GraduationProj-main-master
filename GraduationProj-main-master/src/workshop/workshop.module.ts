import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [WorkshopController],
  providers: [WorkshopService],
})
export class WorkshopModule {}
