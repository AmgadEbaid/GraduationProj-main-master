import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Define the JWT payload interface
interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

@ApiTags('test')
@Controller('test')
export class TestController {
  @ApiOperation({ summary: 'Get public data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns public data that anyone can access',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'This is public data that anyone can access' },
        timestamp: { type: 'string', example: '2025-03-15T15:20:00.000Z' }
      }
    }
  })
  @Get('public')
  public getPublicData() {
    return {
      message: 'This is public data that anyone can access',
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOperation({ summary: 'Get protected data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns protected data that only authenticated users can access',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'This is protected data that only authenticated users can access' },
        user: { 
          type: 'object',
          properties: {
            id: { type: 'string', example: 'c620ff1a-aeb5-4d52-b15e-f6d2e5e16f5c' },
            username: { type: 'string', example: 'amjad Ebaid' }
          }
        },
        timestamp: { type: 'string', example: '2025-03-15T15:20:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  public getProtectedData(@Req() request: Request) {
    // Cast the user to JwtPayload type
    const user = request['user'] as JwtPayload;
    if (!user) {
      return {
        message: 'Unauthorized - Invalid or missing token',
        timestamp: new Date().toISOString(),
      };
    }
    console.log(user);
    
    return {
      message: 'This is protected data that only authenticated users can access',
      user:user,
      timestamp: new Date().toISOString(),
    };
  }
} 