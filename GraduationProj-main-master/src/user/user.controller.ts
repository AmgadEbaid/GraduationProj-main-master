import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateFcmTokenDto } from './dtos/UpdateFcmToken.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('updateFcmToken')
  async updateFcmToken(
    @Req() req: Request,
    @Body() updateFcmToken: UpdateFcmTokenDto,
  ) {
    const user = req['user'] as any;
    return this.userService.updateFcmToken(updateFcmToken, user.id);
  }
}
