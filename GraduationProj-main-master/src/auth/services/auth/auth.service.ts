import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User';
import * as bcrypt from 'bcrypt';
import { createUser } from 'src/user/dtos/createUser.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { OtpService } from '../otp/otp.service';

// Interface for Google user data
interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken?: string; // Make accessToken optional
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private User: Repository<User>,
    private jwtService: JwtService,
    private userservice: UserService,
    private otpService: OtpService,
  ) {}

  async signUp(user: createUser) {
    const users = await this.User.find({ where: { email: user.email } });
    if (users.length) {
      throw new BadRequestException('email is already used');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return await this.User.save(this.User.create(user));
  }

  async login(user: User) {
    const payload = {
      username: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
      sub: user.id,
    };
    return {
      username: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
      id: user.id,
      email: user.email,
      status: user.status,
      isOAuthUser: user.isOAuthUser,
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
      }),
    };
  }

  /**
   * Validates user credentials and returns the user if valid
   * @param loginDto The login credentials
   * @returns The user entity if credentials are valid
   */
  async validateUser(loginDto: LoginDto): Promise<User> {
    // Find user with password included
    const user = await this.User.findOne({
      where: { email: loginDto.email },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'status',
        'phone',
        'isOAuthUser',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if this is an OAuth user trying to use password login
    if (user.isOAuthUser) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please sign in with Google.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is verified
    if (!user.status) {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email first.',
      );
    }

    // Remove password from returned user object
    delete user.password;

    return user;
  }

  /**
   * Initiates the password reset process by sending an OTP
   * @param email The email of the user requesting password reset
   * @returns Information about the OTP sent
   */
  async forgotPassword(email: string) {
    // Check if user exists
    const user = await this.User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if this is an OAuth user
    if (user.isOAuthUser) {
      throw new BadRequestException(
        'This account uses Google Sign-In. Password reset is not available.',
      );
    }

    // Generate and send OTP
    return this.otpService.createOtp(email);
  }

  /**
   * Resets the user's password after OTP verification
   * @param email The user's email
   * @param otp The OTP code
   * @param newPassword The new password
   * @returns The updated user
   */
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<User> {
    // Verify OTP
    const user = await this.otpService.verifyOtp(email, otp);

    // Check if this is an OAuth user
    if (user.isOAuthUser) {
      throw new BadRequestException(
        'This account uses Google Sign-In. Password reset is not available.',
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await this.User.save(user);

    // Return user without password
    delete user.password;
    return user;
  }

  /**
   * Handles login or registration via Google OAuth
   * @param googleUser User data from Google
   * @returns User entity and JWT token
   * @throws ConflictException if the email is already used with password authentication
   */
  async googleLogin(googleUser: GoogleUser) {
    // Check if user exists
    let user = await this.User.findOne({
      where: { email: googleUser.email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'status',
        'phone',
        'isOAuthUser',
        'password',
      ],
    });

    if (!user) {
      // Create a new user if they don't exist
      const newUser = this.User.create({
        email: googleUser.email,
        firstName: `${googleUser.firstName}`,
        lastName: ` ${googleUser.lastName}`,
        // Generate a random password for the user (they won't use it)
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
        status: true, // Auto-verify users who sign in with Google
        phone: '', // You might want to collect this later
        isOAuthUser: true, // Mark as OAuth user
        image: googleUser.picture, // Use Google profile picture
      });

      user = await this.User.save(newUser);
    } else {
      // Check if this is a password user trying to use OAuth
      if (!user.isOAuthUser) {
        throw new ConflictException(
          'This email is already registered with password authentication. Please use password login.',
        );
      }

      // If user exists but isn't verified, verify them
      if (!user.status) {
        user.status = true;
        await this.User.save(user);
      }
    }

    // Remove password from returned user object
    delete user.password;

    // Use the existing login function to generate JWT token
    return this.login(user);
  }
}
