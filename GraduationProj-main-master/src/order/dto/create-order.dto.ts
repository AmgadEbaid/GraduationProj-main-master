import { IsNotEmpty } from "class-validator";
export class CreateOrderDto {
    @IsNotEmpty()
    productIds: string[];
}
