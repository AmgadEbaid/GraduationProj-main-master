import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './Address';
import { Order } from './Order';
import { Review } from './review';
import { Product } from './Product';
import { Message } from './Message';
import { SearchHistory } from './SearchHistory';
import { Repair } from './Repair';
// import { Message } from './Message';

export enum Roles {
  User = 'user',
  Admin = 'admin',
  Workshop = 'workshop',
  Delivery = 'delivery',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    default:
      'https://miro.medium.com/v2/resize:fill:100:100/1*dmbNkD5D-u45r44go_cf0g.png',
  })
  image: string;

  @Column({ default: 50 })
  points: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  // This attribute indicte whether the user signed up with the OTP successfully or not
  @Column({ default: false })
  status: boolean;

  @Column()
  phone: string;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Roles, default: Roles.User })
  role: Roles;
  // Flag to indicate if the user was created via OAuth (Google, etc.)
  @Column({ default: false })
  isOAuthUser: boolean;
  // User Relations
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
  // Orders created by this user (as a customer)
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Orders being delivered by this user (as a delivery person)
  @OneToMany(() => Order, (order) => order.deliveryman)
  deliveryOrders: Order[];
  @OneToMany(() => Review, (review) => review.user)
  review: Review[];
  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => SearchHistory, (searchHistory) => searchHistory.user)
  searchHistories: SearchHistory[];
  @OneToMany(() => Repair, (repair) => repair.user)
  repair: Repair[];
}
