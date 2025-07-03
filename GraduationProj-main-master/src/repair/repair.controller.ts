import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Delete,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RepairService } from './repair.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RepairStatus } from 'entities/Repair';
import { CreateRepairDto } from './dto/create-repair.dto';
import * as multerS3 from 'multer-s3';
import { MulterS3File } from '../user/interface/multer-s3.interface';
import { s3 } from 'src/aws/s3.client';

@UseGuards(JwtAuthGuard)
@Controller('repair')
export class RepairController {
  constructor(private readonly repairService: RepairService) {}

  @Get()
  async getAllRepairs(@Req() req: Request) {
    const userId = req['user'].id;
    const repairs = await this.repairService.getAllRepairs(userId);
    return repairs;
  }

  @UseInterceptors(
      FileInterceptor('image', {
        storage: multerS3({
          s3,
          bucket: process.env.AWS_BUCKET_NAME,
          contentType: multerS3.AUTO_CONTENT_TYPE,
          key: (req, file, cb) => {
            const timestamp = Date.now();
            const fileExtension = file.originalname.split('.').pop();
            const filename = `repair-${timestamp}.${fileExtension}`;
            cb(null, `${process.env.AWS_REPAIR_IMAGES_NAME}/${filename}`);
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
  @Post(':id')
  async makeRepairReq(
    @Body() body: CreateRepairDto,
    @Param('id') workshopId: string,
    @UploadedFile() file: MulterS3File,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    const repair = await this.repairService.makeRepairReq(
      body,
      userId,
      workshopId,
      file
    );
    return repair;
  }

  @Patch(':id')
  async updateRepiarReq(
    @Param('id') repairId,
    @Body('status') status: RepairStatus,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    const updateRepiar = await this.repairService.updateRepairReq(
      userId,
      repairId,
      status,
    );
    return updateRepiar;
  }

  @Delete(':id')
  async deleteRepairReq(@Param('id') repairId: string, @Req() req: Request) {
    const userId = req['user'].id;
    const deleteRepair = await this.repairService.deleteRepair(
      userId,
      repairId,
    );
    return deleteRepair;
  }
}
