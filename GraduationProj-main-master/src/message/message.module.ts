import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { JwtModule } from '@nestjs/jwt';
import { Type } from 'class-transformer';
import { User } from 'entities/User';
import { Message } from 'entities/Message';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Message, User])],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
