import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { Chat } from 'entities/Chat';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'entities/User';
import { Message } from 'entities/Message';

import { ChatGatwayGateway } from './chat-gateway/chat-gateway.gateway';
import { MessageModule } from 'src/message/message.module';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, User, Message]),
    JwtModule,
    MessageModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGatwayGateway, FirebaseService, UserService],
  exports: [ChatService],
})
export class ChatModule {}
