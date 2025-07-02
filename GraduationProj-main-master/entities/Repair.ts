import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { ProductCategories } from './Product';

export enum RepairStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Fullfilled = 'fullfilled',
  cancelled = 'cancelled',
}

export enum PaymentStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  Released = 'Released',
}

export enum PaymentMethod {
  Paypal = 'paypal',
  Payoneer = 'payoneer',
  Cash = 'cash',
  Card = 'card',
}

// export enum ProductType {
//   BUY = 'buy',
//   REPAIR = 'repair',
//   SWAP = 'swap',
// }

export enum ConditionType {
  New = 'new', // Product is brand new
  Used = 'used',
  LikeNew = 'likeNew',
}

@Entity()
export class Repair {
  @PrimaryGeneratedColumn('uuid')
  repairId: string;

  @Column({
    type: 'enum',
    enum: RepairStatus,
    default: RepairStatus.Pending,
    nullable: false,
  })
  status: RepairStatus;

  @Column({ nullable: false })
  cost: string;

  @Column({ nullable: false })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: ProductCategories,
    default: ProductCategories.Chairs,
  })
  productType: ProductCategories;

  @Column({
    type: 'enum',
    enum: ConditionType,
    default: ConditionType.Used,
  })
  productCondition: ConditionType;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.Unpaid,
    nullable: false,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.Card,
    nullable: false,
  })
  paymentMethod: PaymentMethod;

  @Column({ default: new Date().toLocaleString() })
  createdAt: string;

  @Column({ default: new Date().toLocaleString() })
  updatedAt: string;

  // relations
  @ManyToOne(() => User, (user) => user.repair)
  user: User;
  @ManyToOne(() => User, (user) => user.repair)
  workshop: User;
  // @OneToMany(() => Product, (product) => product.repair)
  // products: Product[]
}
