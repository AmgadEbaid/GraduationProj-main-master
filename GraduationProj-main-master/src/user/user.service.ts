import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { createUser } from 'src/user/dtos/createUser.dto';
import { Repository } from 'typeorm';
import { UpdateFcmTokenDto } from './dtos/UpdateFcmToken.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async findOne(id: string) {
    const user = this.UserRepository.findOne({ where: { id } });
    return user;
  }

  async updateFcmToken(updateFcmToken: UpdateFcmTokenDto, userId: string) {
    await this.UserRepository.update(userId, {
      fcmToken: updateFcmToken.fcmToken,
    });
    return { status: 'success', message: 'FCM token updated successfully' };
  }
}
