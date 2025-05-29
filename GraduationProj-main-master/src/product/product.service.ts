import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus, ProductType } from 'entities/Product';
import { Not, Repository } from 'typeorm';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto, userId: string, image: any) {
    if (!image || !image.location) {
      throw new HttpException(
        'Image is required to create a product',
        HttpStatus.BAD_REQUEST,
      );
    }
    const imageUrl = image.location;
    const product = this.ProductRepository.create({
      ...createProductDto,
      imageUrl,
      user: { id: userId },
    });
    await this.ProductRepository.save(product);
    return {
      status: 'success',
      message: 'Product created successfully',
      data: { product },
    };
  }

  async findAllProduct() {
    const products = await this.ProductRepository.find({});
    if (!products.length) {
      return {
        status: 'success',
        message: 'No products found',
      };
    }
    return {
      status: 'success',
      message: 'Products fetched successfully',
      data: { products },
    };
  }
  async findAllProductByUser(userId: string) {
    const products = await this.ProductRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!products.length) {
      return {
        status: 'success',
        message: 'No products found',
      };
    }
    return {
      status: 'success',
      message: 'Products fetched successfully',
      data: { products },
    };
  }
  async myListings(userId: string) {
    const products = await this.ProductRepository.find({
      where: {
        user: {
          id: userId,
        },
        status: ProductStatus.AVAILABLE,
      },
    });
    if (!products.length) {
      return {
        status: 'success',
        message: 'No products found',
      };
    }
    return {
      status: 'success',
      message: 'Products fetched successfully',
      data: { products },
    };
  }
  async findAllProductByType(type: ProductType) {
    const products = await this.ProductRepository.find({
      where: { type },
    });
    if (!products.length) {
      return {
        status: 'success',
        message: 'No products found for the specified type',
      };
    }
    return {
      status: 'success',
      message: 'Products fetched successfully',
      data: { products },
    };
  }

  async findOne(id: string) {
    const product = await this.ProductRepository.findOne({
      where: { id },
    });
    if (!product) {
      return {
        status: 'success',
        message: 'No product found',
      };
    }
    return {
      status: 'success',
      message: 'Product fetched successfully',
      data: { product },
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const product = await this.ProductRepository.findOne({
      where: {
        id,
        status: Not(ProductStatus.SOLD), // Ensure the status is not "SOLD"
      },
      relations: ['user'],
    });
    // Check if the product exists (security check)
    if (!product) {
      throw new HttpException(
        'There is no product with that id, or you are not authourized to updated this product',
        HttpStatus.NOT_FOUND,
      );
    }
    // Check if the user is the owner of the product
    if (product.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this product',
      );
    }
    await this.ProductRepository.update(id, updateProductDto);
    return {
      status: 'success',
      message: 'Product updated successfully',
      data: { ...product, ...updateProductDto },
    };
  }

  async remove(id: string, userId: string) {
    const product = await this.ProductRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    // Check if the product exists (security check)
    if (!product) {
      return {
        status: 'success',
        message: 'No product found',
      };
    }
    // Check if the user is the owner of the product
    if (product.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this product',
      );
    }
    await this.ProductRepository.delete(id);
    return;
  }
}
