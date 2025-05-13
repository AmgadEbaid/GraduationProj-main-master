import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGatwayGateway } from './chat-gateway/chat-gateway.gateway';
import { Chat } from 'entities/Chat';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User]), JwtModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGatwayGateway],
})
export class ChatModule {}
