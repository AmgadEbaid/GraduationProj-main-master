import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';

export enum orderType {
  purchase = 'purchase',
  exchange = 'exchange',
  exchange_plus_cash  = 'exchange_plus_cash',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum paymentMethod {
  cash = 'cash',
  card = 'card',
  wallet = 'wallet',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'float', nullable: false })
  price: number;
  @OneToMany(() => Product, (product) => product.order)
  products: Product[];
  @ManyToOne(() => User, (user) => user.orders)
  user: User;
  @Column({
    type: 'enum',
    enum: orderType,
  })
  type: orderType;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: paymentMethod,
  })
  paymentMethod: paymentMethod;

  @ManyToOne(() => Product, { nullable: true })
  offeredProduct?: Product;

  @Column({ type: 'float', nullable: true })
  cashAmount?: number;
}
