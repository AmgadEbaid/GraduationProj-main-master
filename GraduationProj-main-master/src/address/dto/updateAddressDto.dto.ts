import { IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  fullName?: string;
  @IsOptional()
  streetAddress?: string;
  @IsOptional()
  city?: string;
  @IsOptional()
  state?: string;
  @IsOptional()
  country?: string;
  @IsOptional()
  postalCode?: string;
  @IsOptional()
  @IsPhoneNumber('EG')
  phoneNumber?: string;
}
