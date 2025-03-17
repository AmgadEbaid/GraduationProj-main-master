import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('google-auth')
@Controller('auth/google')
export class GoogleController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Initiate Google OAuth authentication' })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirects to Google authentication page' 
  })
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route initiates the Google OAuth flow
    // The actual implementation is handled by Passport
  }

  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirects to frontend with authentication token' 
  })
  @ApiExcludeEndpoint() // Exclude from Swagger UI as it's not meant to be called directly
  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      // After successful Google authentication, we get the user data from our auth service
      // This is our database user with our JWT token, not the Google user
      const userData = req.user;

      // For web apps, you might redirect to a frontend URL
      // For mobile apps, use a deep link

      // Determine if the request is coming from a mobile app
      const isMobileApp = req.headers['user-agent']?.includes('Flutter');

      if (isMobileApp) {
        // Redirect to your Flutter app using a deep link with our JWT token
        const deepLink = `${process.env.FLUTTER_APP_SCHEME}://auth?token=${userData.access_token}&userId=${userData.id}&email=${userData.email}`;
        return res.redirect(deepLink);
      } else {
        // Redirect to web frontend with our JWT token
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth?token=${userData.access_token}&userId=${userData.id}&email=${userData.email}`,
        );
      }
    } catch (error) {
      console.error('Error in Google callback:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
    }
  }
}
