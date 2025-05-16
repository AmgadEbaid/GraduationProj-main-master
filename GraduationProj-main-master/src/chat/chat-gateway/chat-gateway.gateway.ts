import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat.service';
import { MessageService } from 'src/message/message.service';
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
@WebSocketGateway(3002, { cors: '*' })
export class ChatGatwayGateway {
  private redisClient: RedisClientType;
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private firebaseService: FirebaseService,
    private userService: UserService,
  ) {
    this.redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, // Connection URL for Redis
    });
    this.redisClient.connect(); // Connect to Redis
  }
  @WebSocketServer() server: Server;
  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.headers.auth;

    if (!userId) {
      client.emit('error', { message: 'Authentication header missing' });
      client.disconnect();
      throw new WsException('Authentication header missing');
    } else {
      client['user'] = userId;
      await this.redisClient.set(`user:${userId}:socketId`, client.id);
      await this.redisClient.set(`user:${userId}:status`, 'online');
      console.log('Socket created successfully');
    }
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client['user'];
    if (userId) {
      await this.redisClient.del(`user:${userId}:socketId`);
      await this.redisClient.set(`user:${userId}:status`, 'offline');
      console.log('Socket deleted successfully');
    }
    console.log('Client disconnected:', client.id);
  }
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { receiverId: string; content: string },
  ) {
    const { receiverId, content } = payload;
    const user = client['user'];
    const senderSocket = (await this.redisClient.get(
      `user:${user.userId}:socketId`,
    )) as string;
    const receiverSocket = (await this.redisClient.get(
      `user:${receiverId}:socketId`,
    )) as string;
    if (senderSocket === receiverSocket) {
      client.emit('error', {
        message: 'The the sender socke is the same as the receiver socket ',
      });
      throw new WsException(
        'The the sender socke is the same as the receiver socket ',
      );
    }
    let chat = await this.chatService.findOne(user.userId, {
      recepientId: receiverId,
    });
    if (!chat) {
      client.emit('error', {
        message:
          "Can't send message into uncreated chat please create chat first",
      });
      throw new WsException(
        "Can't send message into uncreated chat please create chat first",
      );
    }
    if (receiverSocket) {
      this.server.to(receiverSocket).emit('message', {
        senderId: user.userId,
        content,
      });
    } else {
      const receiverUser = await this.userService.findOne(receiverId);
      if (!receiverUser) {
        client.emit('error', {
          message: 'Receiver not found',
        });
        throw new WsException('Receiver not found');
      }
      const notification = await this.firebaseService.sendNotification(
        receiverUser.fcmToken,
        'New message',
        content,
        {
          senderId: user.userId,
          chatId: chat.data.id,
        },
      );
      console.log('Notification sent:', notification);
    }
  }
}
