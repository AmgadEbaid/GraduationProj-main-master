import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from 'src/auth/services/otp/otp.service';
import { RequestOtpDto } from 'src/auth/dtos/request-otp.dto';
import { VerifyOtpDto } from 'src/auth/dtos/verify-otp.dto';
import { Otp } from 'entities/Otp';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('otp')
@Controller('auth/otp')
export class OtpController {
  constructor(private otpService: OtpService, private authService: AuthService) {}

  @ApiOperation({ summary: 'Request a new OTP' })
  @ApiBody({ type: RequestOtpDto })
  @ApiResponse({ 
    status: 201, 
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP sent successfully to your email' },
        email: { type: 'string', example: 'user@example.com' },
        expiresAt: { type: 'string', format: 'date-time', example: '2025-03-15T16:20:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid email' })
  @Post('request')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    const otp: Otp = await this.otpService.createOtp(requestOtpDto.email);
    return {
      message: 'OTP sent successfully to your email',
      email: otp.email,
      expiresAt: otp.expiresAt,
    };
  }

  @ApiOperation({ summary: 'Verify an OTP' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP verified successfully' },
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid or expired OTP' })
  @Post('verify')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const user = await this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    const authResult = await this.authService.login(user);
    
    return {
      message: 'OTP verified successfully',
      ...authResult
    };
  }

  @ApiOperation({ summary: 'Resend an OTP' })
  @ApiBody({ type: RequestOtpDto })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP resent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP resent successfully to your email' },
        email: { type: 'string', example: 'user@example.com' },
        expiresAt: { type: 'string', format: 'date-time', example: '2025-03-15T16:20:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid email or too many requests' })
  @Post('resend')
  async resendOtp(@Body() requestOtpDto: RequestOtpDto) {
    const otp = await this.otpService.resendOtp(requestOtpDto.email);
    return {
      message: 'OTP resent successfully to your email',
      email: otp.email,
      expiresAt: otp.expiresAt,
    };
  }
} 