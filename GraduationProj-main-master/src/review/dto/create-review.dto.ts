import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product rating is required' })
  rating: number;
  @IsOptional({})
  comment?: string;
}
