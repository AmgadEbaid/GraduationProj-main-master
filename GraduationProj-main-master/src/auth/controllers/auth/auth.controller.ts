import { Body, Controller, Patch, Post } from '@nestjs/common';
import { User } from 'entities/User';
import { createUser } from 'src/user/dtos/createUser.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Otp } from 'entities/Otp';
import { OtpService } from 'src/auth/services/otp/otp.service';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { ForgotPasswordDto } from 'src/auth/dtos/forgot-password.dto';
import { ResetPasswordDto } from 'src/auth/dtos/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authservice: AuthService,
    private otpService: OtpService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: createUser })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully and OTP sent',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Account created successfully. OTP sent to your email for verification.',
        },
        email: { type: 'string', example: 'user@example.com' },
        expiresAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-03-15T16:20:00.000Z',
        },
        accountStatus: { type: 'string', example: 'pending_verification' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @Post('signup')
  async signup(@Body() User: createUser) {

    const signupUser = await this.authservice.signUp(User);
    const otp: Otp = await this.otpService.createOtp(signupUser.email);
    return {
      message:
        'Account created successfully. OTP sent to your email for verification.',
      email: otp.email,
      expiresAt: otp.expiresAt,
      accountStatus: 'pending_verification',
    };
    
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful' },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'c620ff1a-aeb5-4d52-b15e-f6d2e5e16f5c',
            },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            status: { type: 'string', example: 'active' },
          },
        },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Validate user credentials
    const user = await this.authservice.validateUser(loginDto);

    // Generate JWT token
    const authResult = await this.authservice.login(user);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
        status: user.status,
      },
      ...authResult,
    };
  }

  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset OTP sent',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password reset OTP sent to your email',
        },
        email: { type: 'string', example: 'user@example.com' },
        expiresAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-03-15T16:20:00.000Z',
        },
      },
    },
  })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const otp = await this.authservice.forgotPassword(forgotPasswordDto.email);

    return {
      message: 'Password reset OTP sent to your email',
      email: otp.email,
      expiresAt: otp.expiresAt,
    };
  }

  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset successful' },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid OTP or expired OTP',
  })
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const user = await this.authservice.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      resetPasswordDto.newPassword,
    );

    return {
      message: 'Password reset successful',
      email: user.email,
    };
  }
}
