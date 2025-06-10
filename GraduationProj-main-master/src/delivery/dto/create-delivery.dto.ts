import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MinLength } from "class-validator";

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

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1, { message: 'please select at least one product' })
    products: string[]

}