import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'entities/Chat';
import { User } from 'entities/User';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createChatDto: CreateChatDto, requesterId: string) {
    if (requesterId === createChatDto.recepientId) {
      throw new HttpException(
        'You cannot create a chat with yourself',
        HttpStatus.FORBIDDEN,
      );
    }
    const chatName = `chats${requesterId < createChatDto.recepientId ? requesterId + '_' + createChatDto.recepientId : createChatDto.recepientId + '_' + requesterId}`;
    const existingChat = await this.chatRepository.findOne({
      where: {
        chatName,
      },
    });
    if (existingChat) {
      const chat = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.participants', 'participant')
        .leftJoinAndSelect('chat.messages', 'message')
        .leftJoin('message.sender', 'sender')
        .addSelect([
          'message.id',
          'message.message',
          'message.createdAt',
          'sender.id',
        ])
        .where('chat.id = :id', { id: existingChat.id })
        .getOne();
      return {
        status: 'success',
        message: 'Chat already exists',
        data: { ...chat },
      };
    }
    const existingParticipant = await this.userRepository.findOne({
      where: { id: createChatDto.recepientId },
    });
    if (!existingParticipant) {
      throw new HttpException(
        'Recipient does not exist, make sure to pass correct recipient user',
        HttpStatus.NOT_FOUND,
      );
    }
    const chat = this.chatRepository.create({
      participants: [{ id: requesterId }, { id: createChatDto.recepientId }],
      chatName,
    });
    await this.chatRepository.save(chat);
    return {
      status: 'success',
      message: 'Chat created successfully',
      data: { ...chat },
    };
  }

  findAll() {
    return `This action returns all chat`;
  }

  async findOne(
    senderId: string,
    createChatDto: CreateChatDto,
    returnMessages: boolean = false,
  ) {
    if (senderId === createChatDto.recepientId) {
      throw new HttpException(
        'You cannot create a chat with yourself',
        HttpStatus.FORBIDDEN,
      );
    }
    const chatName = `chats${senderId < createChatDto.recepientId ? senderId + '_' + createChatDto.recepientId : createChatDto.recepientId + '_' + senderId}`;
    let chat = await this.chatRepository.findOne({
      where: {
        chatName,
      },
    });
    if (!chat) {
      return false;
    }
    if (returnMessages) {
      chat = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.participants', 'participant')
        .leftJoinAndSelect('chat.messages', 'message')
        .leftJoin('message.sender', 'sender')
        .addSelect([
          'message.id',
          'message.message',
          'message.createdAt',
          'sender.id',
        ])
        .where('chat.id = :id', { id: chat.id })
        .getOne();
      return {
        status: 'success',
        message: 'Chat found successfully',
        data: { ...chat },
      };
    }
    return {
      status: 'success',
      message: 'Chat found successfully',
      data: { ...chat },
    };
  }
  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }
  // This method finds all chats for a user by their userId
  async findManyByUserId(userId: string) {
    let chats = await this.chatRepository.find({
      where: {
        participants: {
          id: userId,
        },
      },
      select: ['id'],
    });

    if (!chats.length) {
      return {
        status: 'success',
        message: 'No chats found',
      };
    }
    chats = await this.chatRepository.find({
      where: { id: In([...chats.map((chat) => chat.id)]) },
      relations: ['participants'],
    });
    console.log('chats', chats);
    const chatDetails = chats.map((chat) => {
      return {
        chatId: chat.id,
        receiverId: chat.participants.find(
          (participant) => participant.id !== userId,
        ).id,
      };
    });
    return {
      status: 'success',
      message: 'Chats fetched successfully',
      data: { ...chatDetails },
    };
  }
}
