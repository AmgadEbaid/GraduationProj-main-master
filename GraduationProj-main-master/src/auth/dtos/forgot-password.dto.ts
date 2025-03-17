import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address for password reset',
    example: 'user@example.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
} 