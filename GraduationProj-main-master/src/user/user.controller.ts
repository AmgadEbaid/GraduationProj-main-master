import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateFcmTokenDto } from './dtos/UpdateFcmToken.dto';
import { UpdateUserDetailsDto } from './dtos/updateUserDetails';

import { FileInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { MulterS3File } from './interface/multer-s3.interface';
import { s3 } from 'src/aws/s3.client';

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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          const userId = (req['user'] as any).id;
          const timestamp = Date.now();
          const fileExtension = file.originalname.split('.').pop();
          const filename = `user-${userId}-${timestamp}.${fileExtension}`;
          cb(null, `${process.env.AWS_UPDATE_FOLDER_NAME}/${filename}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB max
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Patch('updateUserDetails')
  async updateUserDetails(
    @Req() req: Request,
    @Body() updateUserDetails: UpdateUserDetailsDto,
    @UploadedFile() file: MulterS3File, // This type is correct here
  ) {
    const user = req['user'] as any;

    // file.location contains the public URL to the image

    return this.userService.updateUserDetails(updateUserDetails, user.id, file);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getUserDetails/:id?')
  async getUserDetails(@Req() req: Request, @Param('id') id: string) {
    if (!id) {
      const user = req['user'] as any;
      return this.userService.findOne(user.id);
    }
    // If an ID is provided, fetch that user's details
    return this.userService.findOne(id);
  }
}
