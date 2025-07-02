import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  ValidateIf,

} from 'class-validator';
import { orderType, paymentMethod } from 'entities/Order';

export class CreateOrderDto {
  @IsNotEmpty()
  name: string;
  @IsUUID('all', { each: true })

  @IsNotEmpty()
  @IsUUID()
  targetProductId: string;

  @ValidateIf(
    (o) =>
      o.type === orderType.exchange || o.type === orderType.exchange_plus_cash,
  )
  @IsUUID()
  offeredProductId?: string;



  @IsEnum(paymentMethod)
  paymentMethod: paymentMethod;

  @ValidateIf((o) => o.type === orderType.exchange_plus_cash)
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  points?: number;
}
