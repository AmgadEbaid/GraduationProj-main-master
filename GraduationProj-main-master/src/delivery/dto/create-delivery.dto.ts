import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateDeliveryDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    recipientName: string;

    @IsString()
    @IsNotEmpty()
    recipientPhone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsArray()
    @IsNotEmpty()
    products: string[]

}