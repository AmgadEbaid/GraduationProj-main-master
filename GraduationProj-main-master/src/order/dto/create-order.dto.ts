import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  ValidateIf,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { orderType, paymentMethod } from 'entities/Order';

export class CreateOrderDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  targetProductId: string[];

  @ValidateIf(
    (o) =>
      o.type === orderType.exchange || o.type === orderType.exchange_plus_cash,
  )
  @IsUUID()
  offeredProductId?: string;

  @IsEnum(orderType)
  type: orderType;

  @IsEnum(paymentMethod)
  paymentMethod: paymentMethod;

  @ValidateIf((o) => o.type === orderType.exchange_plus_cash)
  @IsNumber()
  @Min(0)
  cashAmount?: number;
}
