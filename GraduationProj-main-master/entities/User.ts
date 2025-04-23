import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './Address';
import { Order } from './Order';
import { Review } from './review';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

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

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
   @ManyToOne(() => Review, (review) => review.product)
    review:Review;
}
