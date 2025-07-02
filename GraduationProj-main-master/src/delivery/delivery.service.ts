import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery, DeliveryStatus } from 'entities/Delivery';
import { User } from 'entities/User';
import { Product } from 'entities/Product';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery) private readonly Delivery: Repository<Delivery>,
    @InjectRepository(User) private readonly User: Repository<User>,
    @InjectRepository(Product) private readonly Product: Repository<Product>,
  ) {}

  // get delivery requests
  async getDeliveryReqs(userId: string) {
    const user = await this.User.findOne({ where: { id: userId } });

    const deliveries = await this.Delivery.find({
      where: [{ workshop: user }, { user: user }, { delivery: user }],
      relations: {
        user: true,
        workshop: true,
        delivery: true,
      },
    });

    if (deliveries.length < 1) {
      throw new HttpException(
        "you don't have any delivery requests",
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      status: 'success',
      message: `your ${user.role} requests have been returned successfully`,
      deliveries,
    };
  }

  // update delivery request
  async updateDeliveryReq(
    body: UpdateDeliveryDto,
    deliveryId: string,
    userId: string,
  ) {
    const user = await this.User.findOne({ where: { id: userId } });
    const delivery = await this.Delivery.findOne({
      where: { deliveryId },
    });

    if (user.role !== 'delivery') {
      throw new HttpException(
        "you don't have access on delivery Req updating",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!delivery)
      throw new NotFoundException("the delivery request isn't found");

    const { status } = body;
    const currentStatus = delivery.status;

    if (currentStatus === 'pending' && status === DeliveryStatus.onDelivering) {
      delivery.status = status;
      await this.Delivery.save(delivery);
    } else if ( currentStatus === DeliveryStatus.onDelivering && status === DeliveryStatus.Delivered ) {
      delivery.status = status;
      await this.Delivery.save(delivery);
    } else {
      throw new HttpException(
        'Delivery not allowed to change status now',
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      status: 'success',
      message: 'your delivery request has been updated successfully',
      delivery,
    };
  }

  // cancel & delete delivery request
  async cancelDeliveryReq(deliveryId: string, userId: string) {
    const user = await this.User.findOne({ where: { id: userId } });

    if (!['workshop', 'admin'].includes(user.role)) {
      throw new HttpException(
        "you don't have access to cancel this delivery request",
        HttpStatus.BAD_REQUEST,
      );
    }

    const delivery = await this.Delivery.findOne({
      where: { deliveryId },
    });

    if (!delivery) {
      throw new HttpException(
        "the delivery request isn't found",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (delivery.status !== 'pending') {
      throw new HttpException(
        `you can't cancel that delivery request cause it's ${delivery.status}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // await this.Product.update({ delivery }, { delivery: null });
    await this.Delivery.delete({ deliveryId });

    return {
      status: 'success',
      message: 'the delivery request has been cancelled & deleted successfully',
      deletedDeliveries: delivery,
    };
  }
}
