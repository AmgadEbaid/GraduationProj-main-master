import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  fullName: string;
  @Column({ type: 'varchar' })
  streetAddress: string;
  @Column({ type: 'varchar' })
  city: string;
  @Column({ type: 'varchar' })
  state: string;
  @Column({ type: 'varchar' })
  country: string;
  @Column({ type: 'varchar', nullable: true })
  postalCode: string;
  @Column({ type: 'varchar' })
  phoneNumber: string;
  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
