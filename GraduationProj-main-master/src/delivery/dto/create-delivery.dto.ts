import { IsArray, IsNotEmpty, IsString, MinLength } from "class-validator";

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
    @MinLength(1, { each: true, message: 'please select your all products first' })
    products: string[]

}