import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  ConditionType,
  ProductCategories,
  ProductStatus,
  ProductType,
} from 'entities/Product';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  price: number;
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ProductCategories)
  category: ProductCategories;

  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;
  @IsNotEmpty()
  @IsEnum(ConditionType)
  condition: ConditionType;
  @IsOptional()
  @Validate((value) => value !== ProductStatus.SOLD, {
    message: 'Status cannot be "SOLD".',
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
