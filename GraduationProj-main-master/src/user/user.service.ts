import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { createUser } from 'src/user/dtos/createUser.dto';
import { Repository } from 'typeorm';
import { UpdateFcmTokenDto } from './dtos/UpdateFcmToken.dto';
import { UpdateUserDetailsDto } from './dtos/updateUserDetails';

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
  async updateUserDetails(
    updateUserDetails: UpdateUserDetailsDto,
    userId: string,
    image?: any,
  ) {
    let imagePath: string;
    if (image) {
      imagePath = image.location;
    }
    const user = await this.UserRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException(
        'No such user with that Id',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.UserRepository.merge(user, {
      firstName: updateUserDetails.firstName
        ? updateUserDetails.firstName
        : user.firstName,
      lastName: updateUserDetails.lastName
        ? updateUserDetails.lastName
        : user.lastName,
      image: imagePath ? imagePath : user.image,
      dateOfBirth: updateUserDetails.dateOfBirth
        ? updateUserDetails.dateOfBirth
        : user.dateOfBirth,
    });
    await this.UserRepository.save(updatedUser);
    return {
      status: 'success',
      message: 'User details updated successfully',
      data: updatedUser,
    };
  }
}
