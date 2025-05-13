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
// import { Message } from './Message';

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
  name: string;

  // This attribute indicte whether the user signed up with the OTP successfully or not
  @Column({ default: false })
  status: boolean;

  @Column()
  phone: string;

  // Flag to indicate if the user was created via OAuth (Google, etc.)
  @Column({ default: false })
  isOAuthUser: boolean;
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
  @OneToMany(() => Review, (review) => review.user)
  review: Review[];
  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
