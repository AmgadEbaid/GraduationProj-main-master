import {
  IsEmail,
  IsEnum,
  isEnum,
  IsOptional,
  IsPhoneNumber,
  isString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createUser {
  @ApiProperty({
    description: 'User name (4-20 characters)',
    example: 'amgad',
    minLength: 4,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'amgadabdo@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'User password (min 6 characters, must include uppercase, lowercase, number, and special character)',
    example: '13123Arc@12e',
    required: true,
    minLength: 6,
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least 1 number',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least 1 lowercase letter',
  })
  @Matches(/(?=.*[!@#$%^&*()_+])/, {
    message: 'Password must contain at least 1 special character',
  })
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: '12341353214',
    required: true,
  })
  @IsPhoneNumber('EG')
  @IsString()
  phone: string;
}
