import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';
import { Review } from './review';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'float', nullable: false })
  price: number;
  @Column()
  imageUrl: string;
  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
  @ManyToOne(() => Review, (review) => review.product)
  review:Review
}
 