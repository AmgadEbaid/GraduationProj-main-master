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
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ProductType } from 'entities/Product';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { MulterS3File } from '../user/interface/multer-s3.interface';
import { s3 } from 'src/aws/s3.client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          const timestamp = Date.now();
          const fileExtension = file.originalname.split('.').pop();
          const filename = `product-${timestamp}.${fileExtension}`;
          cb(null, `${process.env.AWS_PRODCUT_IMAGES_NAME}/${filename}`);
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
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @UploadedFile() file: MulterS3File,
  ) {
    const user = req['user'] as any;
    return this.productService.create(createProductDto, user.id, file);
  }

  @Get('all')
  findAllProduct() {
    return this.productService.findAllProduct();
  }
  @UseGuards(JwtAuthGuard)
  @Get('allProductsByUser')
  findAllProductByUser(@Req() req: Request) {
    const user = req['user'] as any;
    return this.productService.findAllProductByUser(user.id);
  }
  @Get('allProductsByType/:type')
  findAllProductByType(@Param('type') type: ProductType) {
    return this.productService.findAllProductByType(type);
  }
  @UseGuards(JwtAuthGuard)
  @Get('availableProducts')
  findAvailableProducts(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const user = req['user'] as any;
    return this.productService.myListings(user.id, page, limit);
  }
  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
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
          const filename = `product-${timestamp}.${fileExtension}`;
          cb(null, `${process.env.AWS_PRODCUT_IMAGES_NAME}/${filename}`);
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
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
    @UploadedFile() file: MulterS3File,
  ) {
    const user = req['user'] as any;
    return this.productService.update(id, updateProductDto, user.id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Req() req: Request,
  ) {
    const user = req['user'] as any;
    return this.productService.searchProducts(query, page, limit, user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('home')
  home(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const user = req['user'] as any;
    return this.productService.homePageProducts(user.id, page, limit);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as any;
    return this.productService.remove(id, user.id);
  }
}
