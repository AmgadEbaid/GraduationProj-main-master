import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Req() req: Request, @Body() createChatDto: CreateChatDto) {
    const user = req['user'] as any;
    return this.chatService.create(createChatDto, user.id);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('find-one')
  findOne(@Req() req: Request, @Body() createChatDto: CreateChatDto) {
    const user = req['user'] as any;
    return this.chatService.findOne(user.id, createChatDto, true);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('my-chats')
  async findMyChats(@Req() req: Request) {
    const user = req['user'] as any;
    return this.chatService.findManyByUserId(user.id);
  }
}
