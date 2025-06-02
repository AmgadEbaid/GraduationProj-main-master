import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';
import { OrderProduct } from './OrderProduct';

export enum orderType {
  purchase = 'purchase',
  exchange = 'exchange',
  exchange_plus_cash = 'exchange_plus_cash',
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

@Entity({ name: 'order' })
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
  @Column({ type: 'float', nullable: true })
  cashAmount?: number;

  @Column({ type: 'int', default: 0 })
  usedPoints: number;
  @Column({ type: 'int', default: 0 })
  newPoints: number;

  @ManyToOne(() => Product, { nullable: true })
  offeredProduct?: Product;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    eager: true,
  })
  orderItems: OrderProduct[];
}
