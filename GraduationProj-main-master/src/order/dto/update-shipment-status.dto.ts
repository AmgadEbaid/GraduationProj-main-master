import { IsEnum } from 'class-validator';
import { shippingStatus } from 'entities/Order';

export class updateShipmentStatusDto {
  @IsEnum(shippingStatus)
  status: shippingStatus;
}
