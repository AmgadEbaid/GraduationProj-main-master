import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';

export enum orderType {
  purchase = 'purchase',
  exchange = 'exchange',
  exchange_plus_cash = 'exchange_plus_cash',
}

export enum OrderStatus {
  PENDING = 'pending', // New order, awaiting payment or confirmation
  AWAITING_PAYMENT = 'awaiting_payment', // If payment is not immediate
  CONFIRMED = 'confirmed', // Order accepted, payment verified (if applicable)
 
  // After this, shippingStatus takes over for the journey.
  // Then, once shippingStatus.Delivered:
  COMPLETED = 'completed', // Order delivered and considered finished.
  REJECTED = 'rejected',
}
export enum paid_status {
  paid = 'paid',
  unpaid = 'unpaid',
}

export enum paymentMethod {
  cash = 'cash',
  card = 'card',
  wallet = 'wallet',
}

export enum shippingStatus {
    Pending = 'pending',
    onDelivering = 'onDelivering',
    Delivered = 'delivered',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  price: number;

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

  @ManyToOne(() => User, (user) => user.deliveryOrders, { nullable: true })
  deliveryman: User;

  @Column({
    type: 'enum',
    enum: paid_status,
    default: paid_status.unpaid,
  })
  paidStatus: paid_status;
  @Column({
    type: 'enum',
    enum: shippingStatus,
    default: shippingStatus.Pending,
  })
  shippingStatus: shippingStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date; // When the order was shipped
  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date; // When the order was confirmed by the seller
  @OneToOne(() => Product, { nullable: true })
  @JoinColumn()
  offeredProduct?: Product;
  @ManyToOne(() => User, (user) => user.orders)
  user: User;
  @OneToOne(() => Product)
  @JoinColumn()
  products: Product; // Assuming an order can have multiple products
}
