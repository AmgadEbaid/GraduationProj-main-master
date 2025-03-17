import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from './services/otp/otp.service';
import { OtpController } from './controllers/otp/otp.controller';
import { Otp } from 'entities/Otp';
import { EmailService } from './services/email/email.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleController } from './controllers/google/google.controller';
import { TestController } from './controllers/test/test.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    JwtModule.register({
      secret: process.env.jwt_secret,
      signOptions: { expiresIn: '1d' },
    }), 
    PassportModule.register({ session: true }), 
    UserModule
  ],
  providers: [AuthService, UserService, OtpService, EmailService, GoogleStrategy, JwtAuthGuard],
  controllers: [AuthController, OtpController, GoogleController, TestController],
})
export class AuthModule {}
