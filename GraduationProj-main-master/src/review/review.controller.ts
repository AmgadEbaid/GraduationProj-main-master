import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Product } from 'entities/Product';
@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  create(
    @Req() req: Request,
    @Body('createReviewDto') createReviewDto: CreateReviewDto,
    @Body('productId') productId: string,
  ) {
    const user = req['user'] as any;
    return this.reviewService.create(createReviewDto, user.id, productId);
  }

  @Get('productReviews/:productId')
  findAllreviewsByProduct(@Param('productId') productId: string) {
    return this.reviewService.findAll(productId);
  }
  @Get('userReviews')
  findAllReviewsByUser(@Req() req: Request) {
    const user = req['user'] as any;
    return this.reviewService.getAllReviewsByUser(user.id);
  }
  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch('update/:id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const user = req['user'] as any;
    return this.reviewService.update(id, updateReviewDto, user.id);
  }

  @Delete('delete/:id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as any;
    return this.reviewService.remove(id, user.id);
  }
}
