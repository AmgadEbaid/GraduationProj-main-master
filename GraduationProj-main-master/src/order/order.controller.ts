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
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.create(createOrderDto, user.id);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(':orderId/:productId')
  remove(
    @Param('orderId') orderId: string,
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const user = req['user'] as any;
    return this.orderService.removeProductFromOrder(
      productId,
      orderId,
      user.id,
    );
  }
  @Delete(':id')
  removeOrder(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as any;
    return this.orderService.delete(id, user.id);
  }
}
