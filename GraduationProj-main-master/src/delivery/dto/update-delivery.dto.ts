import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { DeliveryStatus } from "entities/Delivery";


export class UpdateDeliveryDto {

    @IsOptional()
    @IsString()
    @IsEnum(DeliveryStatus)
    status?: DeliveryStatus;

}