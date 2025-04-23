import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'entities/review';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  create(createReviewDto: CreateReviewDto, userId: string, productId: string) {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: { id: userId },
      product: { id: productId },
    });
    this.reviewRepository.save(review);
    return {
      status: 'success',
      message: 'Review created successfully',
      data: { ...review },
    };
  }

  async findAll(productId: string) {
    const reviews = await this.reviewRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: ['user'],
    });

    if (!reviews.length) {
      return {
        status: 'success',
        message: 'No reviews found',
      };
    }
    return {
      status: 'success',
      message: 'Reviews fetched successfully',
      data: { ...reviews },
    };
  }
  async getAllReviewsByUser(userId: string) {
    const reviews = await this.reviewRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!reviews.length) {
      return {
        status: 'success',
        message: 'No reviews found',
      };
    }
    return {
      status: 'success',
      message: 'Reviews fetched successfully',
      data: { ...reviews },
    };
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: 'success',
      message: 'Review fetched successfully',
      data: review,
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    if (review.user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const updatedReview = this.reviewRepository.merge(review, updateReviewDto);
    await this.reviewRepository.save(updatedReview);

    return {
      status: 'success',
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  async remove(id: string, userId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    if (review.user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    await this.reviewRepository.delete(id);

    return {
      status: 'success',
      message: 'Review deleted successfully',
    };
  }
}
