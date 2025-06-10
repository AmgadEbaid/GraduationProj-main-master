import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateRepairDto {

    @IsNotEmpty()
    @IsNumber({ allowNaN: false })
    cost: number;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1, {
        message: 'please select at least one product'
    })
    products: string[]

}