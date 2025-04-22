import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  streetAddress: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  state: string;
  @IsNotEmpty()
  country: string;
  @IsOptional()
  postalCode: string;
  @IsNotEmpty()
  @IsPhoneNumber('EG')
  phoneNumber: string;
}
