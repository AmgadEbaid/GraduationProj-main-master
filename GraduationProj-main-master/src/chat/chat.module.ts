import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGatwayGateway } from './chat-gateway/chat-gateway.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGatwayGateway],
})
export class ChatModule {}
