import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { createUser } from 'src/user/dtos/createUser.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async find(email: string) {
    const users = this.UserRepository.find({ where: { email: email } });
    return users;
  }

  async create(userbody: createUser) {
    const user = await this.UserRepository.create(userbody);
    await this.UserRepository.save(user);
    return user;
  }
}
