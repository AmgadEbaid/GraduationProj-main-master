import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'entities/Order';
import { Not, Repository } from 'typeorm';
import { Product, ProductStatus } from 'entities/Product';

@Injectable()
export class OrderService {
  @InjectRepository(Order) private Order: Repository<Order>;
  @InjectRepository(Product) private Product: Repository<Product>;

  async create(createOrderDto: CreateOrderDto, userId: string) {
    let products: Product[] = [];
    let price: number = 0;
    let name: string = '';
    let offeredProduct: Product | null = null;
    for (const productId of createOrderDto.targetProductId) {
      const product = await this.Product.findOne({
        where: { id: productId, status: ProductStatus.AVAILABLE },
      });
      if (!product) {
        throw new HttpException(
          `Product with id ${productId} not found, or this product not available`,
          HttpStatus.NOT_FOUND,
        );
      }

      products.push(product);
      price += product.price;
      name = product.name + ' ' + name;
    }

    if (createOrderDto.offeredProductId) {
      offeredProduct = await this.Product.findOne({
        where: {
          id: createOrderDto.offeredProductId,
          user: { id: userId },
          status: ProductStatus.AVAILABLE,
        },
        relations: ['user'],
      });
      if (!offeredProduct) {
        throw new HttpException(
          `Offered product with id ${createOrderDto.offeredProductId} not found or not yours`,
          HttpStatus.NOT_FOUND,
        );
      }
      for (const productId of createOrderDto.targetProductId) {
        if (offeredProduct.id === productId) {
          throw new HttpException(
            `You cannot offer and target the same product`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (createOrderDto.type === 'exchange_plus_cash') {
        price = createOrderDto.cashAmount;
      } else if (createOrderDto.type === 'exchange') {
        price = 0;
      }
    }

    const order = this.Order.create({
      products,
      price,
      name,
      user: { id: userId },
      type: createOrderDto.type,
      paymentMethod: createOrderDto.paymentMethod,
      cashAmount: createOrderDto.cashAmount,
      offeredProduct: offeredProduct,
    });

    for (const product of products) {
      await this.Product.update(
        { id: product.id },
        { status: ProductStatus.ON_HOLD },
      );
    }
    if (offeredProduct) {
      await this.Product.update(
        { id: offeredProduct.id },
        { status: ProductStatus.ON_HOLD },
      );
    }
    await this.Order.save(order);
    return {
      status: 'success',
      message: 'Order created successfully',
      data: order,
    };
  }

  async findAll(userId: string) {
    const orders = await this.Order.find({
      where: { user: { id: userId } },
      relations: ['products'],
    });
    if (!orders) {
      return {
        status: 'not found',
        message: 'No orders found',
      };
    }
    return {
      status: 'success',
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  async findOne(id: string) {
    const order = await this.Order.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Order fetched successfully',
      data: order,
    };
  }
  async removeProductFromOrder(
    productId: string,
    orderId: string,
    userId: string,
  ) {
    const { order } = await this.checkId(orderId, userId);
    const product = await this.Product.findOne({ where: { id: productId } });
    if (!product || !order.products.find((p) => p.id === productId)) {
      throw new HttpException(
        'either product not found or the product is not inside the order',
        HttpStatus.NOT_FOUND,
      );
    }

    order.price = order.price - product.price;
    order.products = order.products.filter((p) => p.id !== productId);
    await this.Order.save(order);
    return {
      status: 'success',
      message: 'Product removed from order successfully',
      data: order,
    };
  }
  async delete(id: string, userId: string) {
    const { order } = await this.checkId(id, userId);
    await this.Product.update({ order: { id: order.id } }, { order: null });
    await this.Order.remove(order);
    return;
  }
  private async checkId(orderId: string, userId: string) {
    const order = await this.Order.findOne({
      where: { id: orderId },
      relations: ['user', 'products'],
      select: ['id', 'user', 'products', 'price', 'name'],
    });

    if (!order || !(order.user.id === userId))
      throw new HttpException('Not valid order id', HttpStatus.NOT_FOUND);
    return { order };
  }

  // order.service.ts
  async updateOrderStatus(
    orderId: string,
    userId: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.Order.findOne({
      where: { id: orderId },
      relations: ['products', 'products.user','offeredProduct'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const ownsAllProducts = order.products.every(
      (product) => product.user.id === userId,
    );

    if (!ownsAllProducts) {
      throw new ForbiddenException(
        'You are not authorized to update this order',
      );
    }

    if (![OrderStatus.ACCEPTED, OrderStatus.REJECTED].includes(status)) {
      throw new BadRequestException('Invalid status update');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in a pending state');
    }

    order.status = status;

    if (status === OrderStatus.REJECTED) {
      for (const product of order.products) {
        await this.Product.update(
          { id: product.id },
          { status: ProductStatus.AVAILABLE },
        );
      }
      console.log(order.offeredProduct)
      if (order.offeredProduct) {
        await this.Product.update(
          { id: order.offeredProduct.id },
          { status: ProductStatus.AVAILABLE },
        );
      }
      console.log(order.offeredProduct)
    }

    await this.Order.save(order);
    return order;
  }
}
