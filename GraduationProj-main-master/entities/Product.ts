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
  @ManyToOne(() => User, (user) => user.products, { eager: false })
  user: User;
  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
  @OneToMany(() => Review, (review) => review.product)
  review: Review[];
}
