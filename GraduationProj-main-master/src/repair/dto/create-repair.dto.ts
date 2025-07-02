import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ConditionType, ProductCategories } from "entities/Product";

export class CreateRepairDto {

    @IsNotEmpty()
    @IsString()
    @IsEnum(ProductCategories)
    productType: ProductCategories;

    @IsNotEmpty()
    @IsString()
    @IsEnum(ConditionType)
    productCondition: ConditionType;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    expectedPrice: string;

}