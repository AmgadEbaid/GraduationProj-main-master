import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Product } from './Product';
import { IsOptional } from 'class-validator';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column({ type: 'int', nullable: false })
  rating: number;
  @Column({ type: 'varchar'})
  @IsOptional()
  comment: string;
  @ManyToOne(() => User, (user) => user.review)
  user: User;
  @ManyToOne(() => Product, (product) => product.review)
  product: Product;
}
