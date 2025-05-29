import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';
import { send } from 'process';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('sendNotification')
  sendNotification(
    @Body() sendNotificationDto: { title: string; body: string; token: string },
  ) {
    const { title, body, token } = sendNotificationDto;
    return this.firebaseService.sendNotification(token, title, body);
  }
}
