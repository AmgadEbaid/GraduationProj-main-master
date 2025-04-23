import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'float', nullable: false })
  price: number;
  @OneToMany(() => Product, (product) => product.id)
  products: Product[];
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

}
