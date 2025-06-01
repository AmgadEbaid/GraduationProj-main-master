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
import { OrderStatus } from 'entities/Order';

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
  @Delete('delete/:orderId/:productId')
  remove(
    @Req() req: Request,
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
  ) {
    const user = req['user'] as any;
    return this.orderService.removeProductFromOrder(
      productId,
      orderId,
      user.id,
    );
  }
  // Delete the whole order
  @Delete('delete/:id')
  removeOrder(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.delete(id, user.id);
  }

  @Patch('status/:id')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
    @Req() req,
  ) {
    const userId = req.user.id;
    const updatedOrder = await this.orderService.updateOrderStatus(
      orderId,
      userId,
      status,
    );

    return {
      status: 'success',
      message: `Order ${status.toLowerCase()} successfully`,
      data: updatedOrder,
    };
  }
}
