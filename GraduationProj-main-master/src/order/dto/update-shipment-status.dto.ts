import {
  IsEnum,
} from 'class-validator';
import {  shippingStatus } from 'entities/Order';
console.log('Shipping Status Enum in DTO:', shippingStatus); // Add this line

export class updateShipmentStatusDto {
  @IsEnum(shippingStatus)
  status: shippingStatus;
}
