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
import {
  Order,
  OrderStatus,
  orderType,
  paid_status,
  shippingStatus,
} from 'entities/Order';
import { Not, Repository } from 'typeorm';
import { Product, ProductStatus } from 'entities/Product';
import { Roles, User } from 'entities/User';
import { Delivery, DeliveryType } from 'entities/Delivery';

@Injectable()
export class OrderService {
  @InjectRepository(Order) private Order: Repository<Order>;
  @InjectRepository(Product) private Product: Repository<Product>;
  @InjectRepository(User) private User: Repository<User>;
  @InjectRepository(Delivery) private Delivery: Repository<Delivery>;

  async create(createOrderDto: CreateOrderDto, userId: string) {
    let price: number = 0;

    let name: string = '';
    let offeredProduct: Product | null = null;
    const product = await this.Product.findOne({
      where: {
        id: createOrderDto.targetProductId,
        status: ProductStatus.AVAILABLE,
      },
      relations: ['user'],
    });
    if (!product) {
      throw new HttpException(
        `Product with id ${createOrderDto.targetProductId} not found or not available`,
        HttpStatus.NOT_FOUND,
      );
    }
    price = product.price;

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

      if (offeredProduct.id === product.id) {
        throw new HttpException(
          `You cannot offer and target the same product`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    let ordertype: orderType;
    if (!offeredProduct) ordertype = orderType.purchase;
    else if (createOrderDto.cashAmount && offeredProduct)
      ordertype = orderType.exchange_plus_cash;
    else ordertype = orderType.exchange;

    if (ordertype !== orderType.exchange_plus_cash)
      createOrderDto.cashAmount = 0;

    if (product.user.id === offeredProduct?.user.id) {
      throw new HttpException(
        `You cannot order your own product`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (product.user.id === userId) {
      throw new HttpException(
        `You cannot order your own product`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (ordertype === 'exchange_plus_cash') {
      price = createOrderDto.cashAmount;
    } else if (ordertype === 'exchange') {
      price = 0;
    }

    let discount = 0;
    let usedPoints = 0;
    let user = await this.User.findOne({
      where: { id: userId },
    });
    let points = user.points - createOrderDto.points;
    if (points < 0) {
      throw new HttpException(
        `You don't have enough points`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createOrderDto.points) {
      const requestedDiscount = createOrderDto.points / 10;

      if (requestedDiscount > price) {
        discount = price;
        usedPoints = price * 10;
      } else {
        discount = requestedDiscount;
        usedPoints = createOrderDto.points;
      }

      price -= discount;
    }

    const newPoints = Math.floor(price / 10);

    user.points -= usedPoints;
    await this.User.save(user);

    console.log('newPoints', newPoints);
    console.log('usedPoints', usedPoints);

    const order = this.Order.create({
      products: product,
      price,
      user: { id: userId },
      type: ordertype,
      paymentMethod: createOrderDto.paymentMethod,
      cashAmount: createOrderDto.cashAmount,
      offeredProduct: offeredProduct,
      usedPoints: usedPoints,
      newPoints: newPoints,
    });

    // Save the order first to get its ID
    await this.Order.save(order);

    // Now update the product to set both status and order
    await this.Product.update(
      { id: product.id },
      { status: ProductStatus.ON_HOLD },
    );

    if (offeredProduct) {
      await this.Product.update(
        { id: offeredProduct.id },
        { status: ProductStatus.ON_HOLD },
      );
    }
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

  async delete(id: string, userId: string) {
    const { order } = await this.checkId(id, userId);
    await this.Order.remove(order);
    await this.Product.update(
      { id: order.products.id },
      { status: ProductStatus.AVAILABLE },
    );
    return;
  }
  private async checkId(orderId: string, userId: string) {
    const order = await this.Order.findOne({
      where: { id: orderId },
      relations: ['user', 'products'],
      select: ['id', 'user', 'products', 'price'],
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
      relations: ['products', 'products.user', 'offeredProduct', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Get both the seller and the order's customer
    const seller = await this.User.findOne({ where: { id: userId } });
    const customer = await this.User.findOne({ where: { id: order.user.id } });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if the user is the seller of all products in the order
    const ownsAllProducts = order.products.user.id === seller.id;

    if (!ownsAllProducts) {
      throw new ForbiddenException(
        'You are not authorized to update this order',
      );
    }

    // Define valid status transitions based on current status
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.REJECTED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING],
      [OrderStatus.PROCESSING]: [OrderStatus.AWAITING_SHIPMENT],
      [OrderStatus.AWAITING_SHIPMENT]: [OrderStatus.CONFIRMED], // Seller can put back to confirmed if needed
      [OrderStatus.COMPLETED]: [], // Final state
      [OrderStatus.REJECTED]: [], // Final state
      [OrderStatus.CANCELLED]: [], // Final state
    };

    if (!validTransitions[order.status]?.includes(status)) {
      let errorMessage = '';
      switch (order.status) {
        case OrderStatus.PENDING:
          errorMessage =
            'Order can only be Confirmed or Rejected from Pending status';
          break;
        case OrderStatus.CONFIRMED:
          errorMessage = 'Confirmed order must be moved to Processing status';
          break;
        case OrderStatus.PROCESSING:
          errorMessage =
            'Processing order must be moved to Awaiting Shipment status when ready for pickup';
          break;
        case OrderStatus.AWAITING_SHIPMENT:
          errorMessage = 'You can move the order back to Confirmed if needed';
          break;
        default:
          errorMessage = `Cannot change status from ${order.status} to ${status}`;
      }
      throw new BadRequestException(errorMessage);
    }

    const deleveryman = await this.User.findOne({

      where: { id: order.deliveryman?.id, role: Roles.Delivery },
    });

    const sellerman = await this.User.findOne({
      where: { id: order.products.user.id },
    });


    // Update timestamps and status
    switch (status) {
      case OrderStatus.CONFIRMED:
        order.confirmedAt = new Date();
        break;
      case OrderStatus.REJECTED:
        order.cancelledAt = new Date();
        break;
      case OrderStatus.AWAITING_SHIPMENT:
        const delivery = new Delivery();
            delivery.cost = 50;
            delivery.deliveryDays = 3;
            delivery.productType = order.type;
            delivery.imageUrl = order.products.imageUrl;
            delivery.deliveryType =  DeliveryType.Receive;
            delivery.user = order.user;
            delivery.delivery = deleveryman;
            delivery.FROM_USER = sellerman;
            await this.Delivery.save(delivery);
            if (order.offeredProduct) {
              const delivery = new Delivery();
            delivery.cost = 50;
            delivery.deliveryDays = 3;
            delivery.productType = order.type;
            delivery.imageUrl = order.offeredProduct.imageUrl;
            delivery.deliveryType =  DeliveryType.Receive;
            delivery.user = sellerman;
            delivery.delivery = deleveryman;
            delivery.FROM_USER = order.products.user;
            await this.Delivery.save(delivery);
            }
        break;
    }
    console.log('status', status);
    order.status = status;

    if (status === OrderStatus.REJECTED) {
      // Handle rejection - return points and make products available
      customer.points += order.usedPoints;
      await this.User.save(customer);

      await this.Product.update(
        { id: order.products.id },
        { status: ProductStatus.AVAILABLE },
      );

      if (order.offeredProduct) {
        await this.Product.update(
          { id: order.offeredProduct.id },
          { status: ProductStatus.AVAILABLE },
        );
      }
    }

    // Always give new points for confirmed orders
    if (status === OrderStatus.CONFIRMED) {
      customer.points += order.newPoints;
      await this.User.save(customer);
    }

    await this.Order.save(order);
    return order;
  }

  
  async getOrderDetails(orderId: string) {
    const order = await this.Order.findOne({
      where: { id: orderId },
      relations: [
        'products',
        'user',
        'user.addresses',
        'deliveryman',
        'offeredProduct',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Structure the response
    const orderDetails = {
      orderId: order.id,
      orderType: order.type,
      status: {
        orderStatus: order.status,
        shippingStatus: order.shippingStatus,
        paidStatus: order.paidStatus,
      },
      timestamps: {
        createdAt: order.createdAt,
        confirmedAt: order.confirmedAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        cancelledAt: order.cancelledAt,
      },
      customerInfo: {
        id: order.user.id,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
        phone: order.user.phone,
        image: order.user.image,
        addresses: order.user.addresses.map((addr) => ({
          id: addr.id,
          fullName: addr.fullName,
          streetAddress: addr.streetAddress,
          city: addr.city,
          state: addr.state,
          country: addr.country,
          postalCode: addr.postalCode,
          phoneNumber: addr.phoneNumber,
        })),
      },
      deliveryInfo: order.deliveryman
        ? {
            id: order.deliveryman.id,
            firstName: order.deliveryman.firstName,
            lastName: order.deliveryman.lastName,
            phone: order.deliveryman.phone,
            image: order.deliveryman.image,
          }
        : null,
      products: order.products,
      offeredProduct: order.offeredProduct
        ? {
            id: order.offeredProduct.id,
            name: order.offeredProduct.name,
            description: order.offeredProduct.description,
            price: order.offeredProduct.price,
            condition: order.offeredProduct.condition,
            type: order.offeredProduct.type,
            status: order.offeredProduct.status,
            location: order.offeredProduct.location,
            imageUrl: order.offeredProduct.imageUrl,
            createdAt: order.offeredProduct.createdAt,
          }
        : null,
      pricing: {
        totalPrice: order.price,
        usedPoints: order.usedPoints,
        newPoints: order.newPoints,
        cashAmount: order.cashAmount,
      },
      paymentMethod: order.paymentMethod,
    };

    return {
      status: 'success',
      message: 'Order details fetched successfully',
      data: orderDetails,
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.Order.find({
      where: { user: { id: userId } },
      relations: ['products', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });

    if (!orders.length) {
      return {
        status: 'success',
        message: 'No orders found',
        data: [],
      };
    }

    const orderOverviews = orders.map((order) => ({
      orderId: order.id,
      totalPrice: order.price,
      status: order.status,
      products: order.products.name,
    }));

    return {
      status: 'success',
      message: 'Orders fetched successfully',
      data: orderOverviews,
    };
  }

  async getReceivedOrders(sellerId: string) {
    const orders = await this.Order.find({
      where: {
        products: {
          user: { id: sellerId },
        },
      },
      relations: ['products', 'products.user', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });

    if (!orders.length) {
      return {
        status: 'success',
        message: 'No orders found',
        data: [],
      };
    }

    const orderOverviews = orders.map((order) => ({
      orderId: order.id,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      totalPrice: order.price,
      status: order.status,
      products: order.products.name,
    }));

    return {
      status: 'success',
      message: 'Received orders fetched successfully',
      data: orderOverviews,
    };
  }

  async updateOrderPaymentStatus(
    orderId: string,
    userId: string,
    newPaidStatus: paid_status,
  ) {
    const order = await this.Order.findOne({
      where: { id: orderId },
      relations: ['user', 'products', 'products.user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if the user is the seller of any product in the order
    const isSeller = order.products.user.id === userId;

    if (!isSeller) {
      throw new ForbiddenException(
        'You are not authorized to update payment status for this order',
      );
    }

    // Update the payment status
    order.paidStatus = newPaidStatus;

    await this.Order.save(order);

    return {
      status: 'success',
      message: `Order payment status updated to ${newPaidStatus}`,
      data: {
        orderId: order.id,
        paidStatus: order.paidStatus,
      },
    };
  }
}
