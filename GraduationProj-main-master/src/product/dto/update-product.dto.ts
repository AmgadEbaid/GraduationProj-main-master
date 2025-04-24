import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductStatus, ProductType } from 'entities/Product';
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsInt()
  price?: number;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  imageUrl?: string;
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;
  @IsOptional()
  @IsEnum(ProductStatus)
  staus: ProductStatus;
}
