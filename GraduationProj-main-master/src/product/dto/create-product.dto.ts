import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ProductType } from 'entities/Product';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsInt()
  price: number;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;
}
