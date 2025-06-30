import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order';
import { Review } from './review';
import { User } from './User';
import { Repair } from './Repair';
export enum ProductType {
  BUY = 'buy',
  REPAIR = 'repair',
  SWAP = 'swap',
}
export enum ConditionType {
  New = 'new', // Product is brand new
  Used = 'used',
  LikeNew = 'likeNew',
}
export enum ProductStatus {
  AVAILABLE = 'available', // Product is available for purchase or swapping
  ON_HOLD = 'on_hold', // Product is currently on hold
  SOLD = 'sold', // Product is sold successfully
  Repaired = 'repaired', // Product is repaired
}
export enum PriceType {
  Fixed = 'fixed', // Fixed price
  Negotiable = 'negotiable', // Price is negotiable
}
export enum ProductCategories {
  LivingRoom = 'Living Room',
  Bedroom = 'Bedroom',
  DiningKitchen = 'Dining & Kitchen',
  HomeOffice = 'Home Office',
  OutdoorPatio = 'Outdoor & Patio',
  KidsNursery = "Kids' & Nursery",
  StorageFurniture = 'Storage Furniture',
  AccentFurniture = 'Accent Furniture',
  SofasSectionals = 'Sofas & Sectionals',
  BedsHeadboards = 'Beds & Headboards',
  Tables = 'Tables',
  Chairs = 'Chairs',
  BookshelvesCabinets = 'Bookshelves & Cabinets',
  DressersChests = 'Dressers & Chests',
  TVStandsMediaConsoles = 'TV Stands & Media Consoles',
  Desks = 'Desks',
  OfficeChairs = 'Office Chairs',
  PatioSets = 'Patio Sets',
  DiningSets = 'Dining Sets',
  Mattresses = 'Mattresses',
  OtherFurniture = 'Other Furniture',
}
@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'float', nullable: false })
  price: number;
  @Column('longtext', { nullable: true })
  description: string;
  @Column()
  imageUrl: string;
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.BUY,
  })
  type: ProductType;
  @Column({ type: 'enum', enum: ConditionType })
  condition: ConditionType;
  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.AVAILABLE, // Default status is "available"
  })
  status: ProductStatus;

  @Column({
    type: 'enum',
    enum: ProductCategories,
  })
  category: ProductCategories;

  @Column({ nullable: true })
  location: string; // Location of the product, e.g., city or area
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: PriceType, default: PriceType.Fixed })
  priceType: PriceType;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  user: User;
  
  @OneToMany(() => Review, (review) => review.product)
  review: Review[];
  @ManyToOne(() => Repair, (repair) => repair.products)
  @JoinColumn({ name: 'repairId' })
  repair: Repair;
}
