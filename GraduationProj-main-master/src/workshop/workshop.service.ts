import { Injectable } from '@nestjs/common';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles, User } from 'entities/User';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createWorkshopDto: CreateWorkshopDto) {
    return 'This action adds a new workshop';
  }

  async findAll() {
    const workshops = await this.userRepository.find({
      where: {
        role: Roles.Workshop,
      },
      select: [
        'id',
        'workshopName',
        'workshopSpecialization',
        'email',
        'phone',
      ],
    });
    if (!workshops || workshops.length === 0) {
      return {
        status: 'success',
        message: 'No workshops found',
      };
    }
    return {
      status: 'success',
      message: 'Workshops fetched successfully',
      data: workshops,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} workshop`;
  }

  update(id: number, updateWorkshopDto: UpdateWorkshopDto) {
    return `This action updates a #${id} workshop`;
  }

  remove(id: number) {
    return `This action removes a #${id} workshop`;
  }
}
