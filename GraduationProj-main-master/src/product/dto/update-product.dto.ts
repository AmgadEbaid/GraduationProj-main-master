import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ConditionType,
  ProductCategories,
  ProductStatus,
  ProductType,
} from 'entities/Product';

export enum ProductStatusWithoutSold {
  AVAILABLE = 'available', // Product is available for purchase or swapping
  ON_HOLD = 'on_hold', // Product is currently on hold
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  price?: number;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;
  @IsOptional()
  @IsEnum(ProductStatusWithoutSold)
  staus: ProductStatusWithoutSold;
  @IsOptional()
  @IsEnum(ProductCategories)
  category?: ProductCategories;
  @IsOptional()
  @IsString()
  location?: string;
  @IsOptional()
  @IsEnum(ConditionType)
  condition?: ConditionType;
}
