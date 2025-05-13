import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '../chat.service';
import { MessageService } from 'src/message/message.service';
import { Inject } from '@nestjs/common';
@WebSocketGateway(3002, { cors: '*' })
export class ChatGatwayGateway {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.redisClient = createClient({
      url: 'redis://localhost:6379', // Connection URL for Redis
    });
    this.redisClient.connect(); // Connect to Redis
  }
  @WebSocketServer() server: Server;
  handleConnection(@ConnectedSocket() client: any) {
    console.log('Client connected:', client.id, client.handshake.headers.auth);
  }
  handleDisconnect(@ConnectedSocket() client: any) {
    console.log('Client disconnected:', client.id);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
