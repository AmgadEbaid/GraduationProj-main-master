import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'entities/Chat';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}
  async create(createChatDto: CreateChatDto, requesterId: string) {
    const chatName = `chats${requesterId < createChatDto.recepientId ? requesterId + '_' + createChatDto.recepientId : createChatDto.recepientId + '_' + requesterId}`;
    const existingChat = await this.chatRepository.findOne({
      where: {
        chatName,
      },
    });
    if (existingChat) {
      throw new HttpException('Chat already exists', HttpStatus.FORBIDDEN);
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

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
