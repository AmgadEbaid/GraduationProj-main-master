import { IsArray, IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class CreateRepairDto {

    @IsNotEmpty()
    @IsNumber({ allowNaN: false })
    cost: number;

    @IsNotEmpty()
    @IsArray()
    @MinLength(1, {
        each: true,
        message: 'please select your all products first'
    })
    products: string[]

}