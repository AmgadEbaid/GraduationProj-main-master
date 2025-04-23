import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product rating is required' })
  @Min(1)
  @Max(5)
  rating: number;
  @IsOptional()
  comment?: string;
}
