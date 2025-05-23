import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order';
import { Review } from './review';
import { User } from './User';
export enum ProductType {
  BUY = 'buy',
  REPAIR = 'repair',
  SWAP = 'swap',
}
export enum ConditionType {
  Used = 'used',
  LikeNew = 'likeNew',
}
export enum ProductStatus {
  AVAILABLE = 'available', // Product is available for purchase or swapping
  ON_HOLD = 'on_hold', // Product is currently on hold
  SOLD = 'sold', // Product is sold successfully
}
@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'float', nullable: false })
  price: number;
  @Column({ type: 'varchar', nullable: false })
  description: string;
  @Column()
  imageUrl: string;
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.BUY,
  })
  type: ProductType;
  @Column({ type: 'enum', enum: ConditionType })
  condition: ConditionType;
  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.AVAILABLE, // Default status is "available"
  })
  status: ProductStatus;
  @ManyToOne(() => User, (user) => user.products, { eager: false })
  user: User;
  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
  @OneToMany(() => Review, (review) => review.product)
  review: Review[];
}
