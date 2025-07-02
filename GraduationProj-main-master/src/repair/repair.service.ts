import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair, RepairStatus } from 'entities/Repair';
import { Roles, User } from 'entities/User';
import { Repository } from 'typeorm';
import { CreateRepairDto } from './dto/create-repair.dto';
import { MulterS3File } from 'src/user/interface/multer-s3.interface';
import { deleteFileFromS3 } from 'src/aws/s3DeleteFile';
import { Delivery, DeliveryType } from 'entities/Delivery';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(Repair) private readonly Repair: Repository<Repair>,
    @InjectRepository(User) private readonly User: Repository<User>,
    @InjectRepository(Delivery) private readonly Delivery: Repository<Delivery>,
  ) {}

  // get repair requests based on user role
  async getAllRepairs(userId: string) {
    const user = await this.User.findOne({ where: { id: userId } });

    if (user.role === 'user') {
      const repairs = await this.Repair.find({
        where: {
          user: { id: userId },
        },
        relations: {
          user: true,
          workshop: true,
          products: true,
        },
      });

    if (repairs.length < 1) {
      throw new HttpException(
        "you don't have any repair rquests yet",
        HttpStatus.BAD_REQUEST,
      );
    }

      return {
        status: 'success',
        message: 'all repair requests has been returned successfully',
        repairs,
      };
    }

    if (user.role === 'workshop') {
      const repairs = await this.Repair.find({
        where: {
          user: { id: userId },
        },
        relations: {
          workshop: true,
          user: true,
          products: true,
        },
      });

      if (repairs.length < 1) {
        throw new HttpException(
          'you don\'t have any repair rquests yet',
          HttpStatus.BAD_REQUEST
        )
      }

      return {
        status: 'success',
        message: 'all repair requests has been returned successfully',
        repairs,
      };
    }

    throw new HttpException(
      'there isn\'t repair repair requests',
      HttpStatus.BAD_REQUEST,
    );
  }

  // create repair request based on user and workshop on products
  async makeRepairReq(
    body: CreateRepairDto,
    userId: string,
    workshopId: string,
    file: MulterS3File,
  ) {
    const { productType, productCondition, description, expectedPrice } = body;

    if (!file) {
      throw new HttpException(
        "please upload product's image first",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userId === workshopId)
      throw new HttpException(
        "you can't make that repair request",
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.User.findOne({
      where: {
        id: userId,
      },
    });

    const workshop = await this.User.findOne({
      where: {
        id: workshopId,
      },
    });

    if (!user || !workshop) {
      throw new HttpException(
        'failed to make a repair request!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const repair = new Repair();
    repair.user = user;
    repair.workshop = workshop;
    repair.cost = expectedPrice;
    repair.imageUrl = file.location;
    repair.productType = productType;
    repair.productCondition = productCondition;
    repair.description = description || '';

    await this.Repair.save(repair);

    return {
      status: 'success',
      message: 'repair request has been created successfully',
      repair,
    };
  }

  // workshop updating process
  async updateRepairReq(
    userId: string,
    repairId: string,
    status: RepairStatus,
  ) {
    const user = await this.User.findOne({ where: { id: userId } });

    if (user.role !== 'workshop') {
      throw new HttpException(
        "you don\'t have the access on product repairing",
        HttpStatus.BAD_REQUEST,
      );
    }

    const repair = await this.Repair.findOne({
      where: { repairId },
      relations: {
        user: true,
        workshop: true,
      },
    });

    if (!repair) {
      throw new HttpException(
        "the repair request is't found",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      ![
        RepairStatus.Accepted,
        RepairStatus.Rejected,
        RepairStatus.Fullfilled,
      ].includes(status)
    ) {
      throw new HttpException(
        'invalid repair status update',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (repair.status === status) {
      throw new HttpException(
        `the product is already ${repair.status}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (status === RepairStatus.Rejected) {
      await this.Repair.delete({ repairId });

      const filekey = await repair.imageUrl.split('/').pop();
      await deleteFileFromS3(filekey);

      return {
        status: 'success',
        message: 'your repair request has been rejected and deleted',
      };
    }

    // accept and fullfilled status updating
    await this.Repair.update(
      { repairId },
      {
        status,
        updatedAt: new Date().toLocaleString(),
      },
    );

    const deliveryUser = await this.User.findOne({
      where: { email: repair.user.email },
    });
    const WorkshopCom = await this.User.findOne({
      where: { email: repair.workshop.email },
    });
    const deliveryCom = await this.User.findOne({
      where: { role: Roles.Delivery },
    });

    const delivery = new Delivery();
    delivery.cost = 50;
    delivery.deliveryDays = 3;
    delivery.productType = repair.productType;
    delivery.imageUrl = repair.imageUrl;
    delivery.deliveryType = status === 'accepted'? DeliveryType.Receive: DeliveryType.Deliver;
    delivery.user = deliveryUser;
    delivery.workshop = WorkshopCom;
    delivery.delivery = deliveryCom;
    await this.Delivery.save(delivery);

    return {
      status: 'success',
      message: 'your repair request has been accepted and waited for delivery',
    };
  }

  // cancel & Delete Repair Req in < Pending > case.
  async deleteRepair(userId: string, repairId: string) {
    const user = await this.User.findOne({ where: { id: userId } });

    if (![Roles.User, Roles.Admin].includes(user.role)) {
      throw new HttpException(
        "you can't cancel this repair request",
        HttpStatus.BAD_REQUEST,
      );
    }

    const repair = await this.Repair.findOne({
      where: { repairId },
    });

    const filekey = await repair.imageUrl.split('/').pop();
    await deleteFileFromS3(filekey);

    if (!repair) {
      throw new HttpException(
        "the repair request is't found !",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (repair.status !== 'pending') {
      throw new HttpException(
        "you can't cancel this repair request",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.Repair.delete({ repairId, status: RepairStatus.Pending });

    return {
      status: 'success',
      message: 'repair request has been cancelled & deleted successfully',
      canceledRepair: repair,
    };
  }
}
