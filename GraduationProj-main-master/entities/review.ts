import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Product } from './Product';
import { IsOptional, Max, Min } from 'class-validator';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  @Min(1)
  @Max(5)
  rating: number;
  @Column({ type: 'varchar' })
  @IsOptional()
  comment: string;
  @ManyToOne(() => User, (user) => user.review)
  user: User;
  @ManyToOne(() => Product, (product) => product.review)
  product: Product;
  @CreateDateColumn()
  createdAt: Date;
}
