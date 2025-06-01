import {
  IsEnum,
} from 'class-validator';
import { OrderStatus } from 'entities/Order';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
