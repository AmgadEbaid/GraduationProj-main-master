import { IsOptional, Max, Min, ValidateIf } from 'class-validator';

export class UpdateReviewDto {
  @ValidateIf((o) => o.comment !== undefined || o.rating !== undefined)
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @ValidateIf((o) => o.rating !== undefined || o.comment !== undefined)
  @IsOptional()
  comment?: string;
}
