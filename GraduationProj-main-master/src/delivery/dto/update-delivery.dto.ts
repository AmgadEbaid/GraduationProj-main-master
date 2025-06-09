import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { DeliveryStatus } from "entities/Delivery";


export class UpdateDeliveryDto {

    @IsOptional()
    @IsNumber()
    cost?: number;

    @IsOptional()
    @IsNumber()
    deliveryDays?: number;

    @IsOptional()
    @IsString()
    @IsEnum(DeliveryStatus)
    status?: DeliveryStatus;

}