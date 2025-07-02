import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus, ProductType } from 'entities/Product';
import { MoreThanOrEqual, Not, Repository } from 'typeorm';
import { SearchHistoryService } from 'src/search-history/search-history.service';
import axios from 'axios';
import { SearchHistory } from 'entities/SearchHistory';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
    @InjectRepository(SearchHistory)
    private readonly SearchHistoryRepository: Repository<SearchHistory>,
    private readonly searchHistoryService: SearchHistoryService,
  ) {}
  private readonly apiUrl = 'https://api.mymemory.translated.net/get';
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
  async myListings(userId: string, page = 1, limit = 20) {
    const products = await this.ProductRepository.createQueryBuilder('product')
      .where('product.user.id = :userId', { userId })
      .andWhere('product.status = :status', {
        status: ProductStatus.AVAILABLE,
      })
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
    image?: any,
  ) {
    const product = await this.ProductRepository.findOne({
      where: {
        id,
        status: Not(ProductStatus.SOLD),
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

    const imageUrl =
      image && image.location ? image.location : product.imageUrl;

    if (product.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this product',
      );
    }
    const updatedProduct = await this.ProductRepository.merge(product, {
      ...updateProductDto,
      imageUrl,
    });
    await this.ProductRepository.save(updatedProduct);
    return {
      status: 'success',
      message: 'Product updated successfully',
      data: { updatedProduct },
    };
  }

  async searchProducts(
    query: string,
    page = 1,
    limit = 20,
    userId?: string,
    saveSearchHistory = true,
  ) {
    if (!query || query.trim() === '') {
      throw new HttpException(
        'Search query cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    const keywords = query.trim().split(/\s+/);
    const translatedKeywords = await Promise.all(
      keywords.map(async (word) => {
        const language = this.detectLanguage(word);
        if (language === 'ar') {
          return {
            original: word,
            translated: await this.translateText(word, 'ar', 'en'),
            type: 'ar', // For name/description
          };
        } else {
          return {
            original: word,
            translated: await this.translateText(word, 'en', 'ar'),
            type: 'en', // For category
          };
        }
      }),
    );
    const whereConditions = translatedKeywords
      .map((kw, i) => {
        const conditions = [];

        if (kw.type === 'ar') {
          conditions.push(
            `(product.name LIKE :original${i} OR product.description LIKE :original${i})`,
            `(product.category LIKE :translated${i})`,
          );
        } else {
          conditions.push(
            `(product.name LIKE :translated${i} OR product.description LIKE :translated${i})`,
            `(product.category LIKE :original${i})`,
          );
        }

        return `(${conditions.join(' OR ')})`;
      })
      .join(' AND ');
    const parameters = Object.fromEntries(
      translatedKeywords.flatMap((kw, i) => [
        [`original${i}`, `%${kw.original}%`],
        [`translated${i}`, `%${kw.translated}%`],
      ]),
    );
    const products = await this.ProductRepository.createQueryBuilder('product')
      .leftJoin('product.user', 'user') // join the user relation
      .addSelect(['user.id']) // select only the user id
      .where(whereConditions, parameters)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    if (userId && saveSearchHistory) {
      await this.searchHistoryService.saveSearchHistory(keywords, userId);
    }
    return {
      status: 'success',
      message: 'Products fetched successfully',
      data: { products },
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
  async homePageProducts(userId: string, page = 1, limit = 20) {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    //First, check if the user has any search history
    const searchHistories = await this.SearchHistoryRepository.find({
      where: { user: { id: userId } },
      order: { searchedAt: 'DESC' },
      take: 5,
    });

    let products = [];
    // If the user has no search history, fetch random products
    if (searchHistories.length === 0) {
      products = await this.ProductRepository.createQueryBuilder('product')
        .leftJoin('product.user', 'user') // join the user relation
        .addSelect(['user.id']) // select only the user id
        .where('product.status = :status', {
          status: ProductStatus.AVAILABLE,
        })
        .orderBy('RAND()')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    } else {
      // If the user has search history, fetch products based on keywords
      const keywords = [
        ...new Set(searchHistories.map((history) => history.keyword)),
      ];

      const productResults = await Promise.all(
        keywords.map(async (word) => {
          const product = await this.searchProducts(
            word,
            page,
            Math.floor(limit / keywords.length),
            userId,
            false,
          );
          return product.data.products;
        }),
      );
      products = productResults.flat();
    }

    return {
      status: 'success',
      message: 'Products fetched successfully',
      data: { products },
    };
  }
  private async translateText(
    text: string,
    from: string,
    to: string,
  ): Promise<string> {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          q: text,
          langpair: `${from}|${to}`,
        },
      });

      return response.data.responseData.translatedText;
    } catch (error) {
      console.error('Translation error:', error.message);
      return text; // fallback to original if translation fails
    }
  }
  private detectLanguage(word: string): 'ar' | 'en' {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(word) ? 'ar' : 'en';
  }
}
