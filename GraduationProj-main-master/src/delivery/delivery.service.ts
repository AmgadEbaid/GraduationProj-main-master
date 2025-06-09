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
import { Product, ProductStatus } from 'entities/Product';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
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

    if (!['workshop', 'delivery'].includes(user.role)) {
      throw new HttpException(
        "you don't have any delivery requests",
        HttpStatus.BAD_REQUEST,
      );
    }

    const deliveries = await this.Delivery.find({
      where: [{ workshop: user }, { delivery: user }],
      relations: {
        workshop: true,
        delivery: true,
        products: true,
      },
    });

    if (deliveries.length < 1) {
      throw new HttpException(
        "you don't have any delivery requests yet",
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      status: 'success',
      message: `your ${user.role} requests have been returned successfully`,
      deliveries,
    };
  }

  // make delivery request
  async makeDeliveryReq(
    body: CreateDeliveryDto,
    deliveryId: string,
    userId: string,
  ) {
    const { title, recipientName, recipientPhone, address, products } = body;

    if (!products || products.length < 1) {
      throw new HttpException(
        'please select your products first',
        HttpStatus.BAD_REQUEST,
      );
    }

    const delivery = await this.User.findOne({ where: { id: deliveryId } });

    if (!delivery) {
      throw new HttpException(
        "delivery company isn't found",
        HttpStatus.BAD_REQUEST,
      );
    }

    const workshop = await this.User.findOne({ where: { id: userId } });

    if (workshop.role !== 'workshop') {
      throw new HttpException(
        "you can\'t handle that delivery request",
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!workshop) {
      throw new HttpException(
        "the workshop isn'\t found",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const deliveryProducts: Product[] = [];
    for (const productId of products) {
      const product = await this.Product.findOne({ where: { id: productId } });

      if (
        ![ProductStatus.AVAILABLE, ProductStatus.Repaired].includes(
          product.status,
        )
      ) {
        throw new HttpException(
          `you can\'t handle that ${product.name} product cause it's ${product.status}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      product.status = ProductStatus.onDelivering;
      await this.Product.save(product);

      deliveryProducts.push(product);
    }

    const deliveryObj = new Delivery();
    deliveryObj.workshop = workshop;
    deliveryObj.delivery = delivery;
    deliveryObj.products = deliveryProducts;
    deliveryObj.title = title;
    deliveryObj.recipientName = recipientName;
    deliveryObj.recipientPhone = recipientPhone;
    deliveryObj.address = address;

    await this.Delivery.save(deliveryObj);

    return {
      status: 'success',
      message: 'delivery request has been sent successfully',
      data: deliveryObj,
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
      relations: { products: true },
    });

    if (!['workshop', 'delivery'].includes(user.role)) {
      throw new HttpException(
        "you don't have access on delivery Req updating",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!delivery)
      throw new NotFoundException("the delivery request isn't found");

    const isWorkshop = user.role === 'workshop';
    const isDelivery = user.role === 'delivery';

    const { status } = body;
    const currentStatus = delivery.status;

    if (isDelivery) {
      if (currentStatus === 'pending' && status === 'proposed') {
        const { cost, deliveryDays } = body;
        if (!cost || !deliveryDays) {
          throw new HttpException(
            'please enter your cost & delivery days first',
            HttpStatus.BAD_REQUEST,
          );
        }
        delivery.cost = cost;
        delivery.deliveryDays = deliveryDays;
        delivery.status = DeliveryStatus.Proposed;
        await this.Delivery.save(delivery);
        return {
          status: 'success',
          message: 'your details have been sent successfully',
          delivery,
        };
      } else if (currentStatus === 'onDelivering' && status === 'delivered') {
        delivery.status = DeliveryStatus.Delivered;
        await this.Delivery.save(delivery);

        for (const product of delivery.products) {
          product.status = ProductStatus.Delivered;
          await this.Product.save(product);
        }

        return {
          status: 'success',
          message: `congratulations, you finshied that ${delivery.title} delivery`,
          delivery,
        };
      } else {
        throw new HttpException(
          'Delivery not allowed to change status now',
          HttpStatus.FORBIDDEN,
        );
      }
    } else if (isWorkshop) {
      if (
        currentStatus === 'proposed' &&
        ['onDelivering', 'rejected'].includes(status)
      ) {
        delivery.status = status;
        await this.Delivery.save(delivery);
        return {
          status: 'success',
          message: 'your response has been sent successfully',
          delivery,
        };
      } else {
        throw new HttpException(
          'Workshop not allowed to change status now',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException('Unauthorized role', HttpStatus.UNAUTHORIZED);
    }
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
      relations: { products: true },
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

    for (const product of delivery.products) {
      product.status = ProductStatus.AVAILABLE;
      await this.Product.save(product);
    }

    await this.Product.update({ delivery }, { delivery: null });
    await this.Delivery.delete({ deliveryId });

    return {
      status: 'success',
      message: 'the delivery request has been cancelled & deleted successfully',
      deletedDeliveries: delivery,
    };
  }
}
