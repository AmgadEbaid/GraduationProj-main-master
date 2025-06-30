import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { OrderStatus, paid_status, shippingStatus } from 'entities/Order';

import { updateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.create(createOrderDto, user.id);
  }

  @Get('getAll')
  findAll(@Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.findAll(user.id);
  }

  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // remove product from the cart of the order
  
  // Delete the whole order
  @Delete('delete/:id')
  removeOrder(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.delete(id, user.id);
  }

  @Patch('status/:id')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() Body: UpdateOrderStatusDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const newStatus = Body.status as OrderStatus;
    const updatedOrder = await this.orderService.updateOrderStatus(
      orderId,
      userId,
      newStatus,
    );

    return {
      status: 'success',
      data: updatedOrder,
    };
  }

  @Get('my-orders')
  async getUserOrders(@Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.getUserOrders(user.id);
  }

  @Get('received-orders')
  async getReceivedOrders(@Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.getReceivedOrders(user.id);
  }

  @Patch(':orderId/payment-status')
  async updateOrderPaymentStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: paid_status,
    @Req() req: Request,
  ) {
    const user = req['user'] as any;
    return this.orderService.updateOrderPaymentStatus(orderId, user.id, status);
  }

  @Get('details/:orderId')
  async getOrderDetails(@Param('orderId') orderId: string) {
    return this.orderService.getOrderDetails(orderId);
  }

  @Post(':orderId/accept-delivery')
  async acceptDeliveryOrder(
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ) {
    const deliveryman = req['user'] as any;
    return this.orderService.delverymanAcceptOrder(orderId, deliveryman);
  }

  @Patch(':orderId/delivery-status')
  async updateDeliveryStatus(
    @Param('orderId') orderId: string,
    @Body() body: updateShipmentStatusDto, 
    @Req() req: Request,
  ) {
    const user = req['user'] as any;
    const newStatus = body.status as shippingStatus;
    return this.orderService.updateDeliveryStatus(orderId, user.id,newStatus);
  }

  @Get('available-for-delivery')
  async findAvailableOrdersForDelivery() {
    return this.orderService.findAvailableOrdersForDelivery();
  }
}
