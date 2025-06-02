import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { Order } from './Order';
import { Review } from './review';
import { User } from './User';
import { Repair } from './Repair';
export enum ProductType {
  BUY = 'buy',
  REPAIR = 'repair',
  SWAP = 'swap',
}
export enum ConditionType {
  New = 'new', // Product is brand new
  Used = 'used',
  LikeNew = 'likeNew',
}
export enum ProductStatus {
  AVAILABLE = 'available', // Product is available for purchase or swapping
  ON_HOLD = 'on_hold', // Product is currently on hold
  SOLD = 'sold', // Product is sold successfully
  Repaired = 'repaired', // Product is repaired
}
export enum ProductCategories {
  Chair = 'chair',
  Table = 'table',
  Sofa = 'sofa',
  Bed = 'bed',
  Desk = 'desk',
  Cabinet = 'cabinet',
  Lighting = 'lighting',
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

  @Column({
    type: 'enum',
    enum: ProductCategories,
  })
  category: ProductCategories;

  @Column({ nullable: true })
  location: string; // Location of the product, e.g., city or area
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  user: User;
  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
  @OneToMany(() => Review, (review) => review.product)
  review: Review[];
  @ManyToOne(() => Repair, (repair) => repair.products)
  @JoinColumn({ name: 'repairId' })
  repair: Repair;
}
