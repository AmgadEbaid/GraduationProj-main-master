import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../services/auth/auth.service';
import * as passport from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      state: true, // Enable state parameter for security
    });

    // Set up passport serialization for sessions
    passport.serializeUser((user: any, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj: any, done) => {
      done(null, obj);
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;
      
      // Extract user data from Google profile
      const googleUser = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
      };

      // Use our auth service to create/find the user in our database and generate our JWT token
      // This will create a new user in our database if they don't exist
      const ourDatabaseUser = await this.authService.googleLogin(googleUser);
      
      // Pass our database user with our JWT token to the callback
      done(null, ourDatabaseUser);
    } catch (error) {
      done(error, null);
    }
  }
} 