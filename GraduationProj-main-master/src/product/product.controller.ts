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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ProductType } from 'entities/Product';
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    const user = req['user'] as any;
    return this.productService.create(createProductDto, user.id);
  }

  @Get('AllProducts')
  findAllProduct() {
    return this.productService.findAllProduct();
  }
  @Get('AllProductsByUser')
  findAllProductByUser(@Req() req: Request) {
    const user = req['user'] as any;
    return this.productService.findAllProductByUser(user.id);
  }
  @Get('AllProductsByType/:type')
  findAllProductByType(@Param('type') type: ProductType) {
    return this.productService.findAllProductByType(type);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('update:id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as any;
    return this.productService.update(id, updateProductDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as any;
    return this.productService.remove(id, user.id);
  }
}
