import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'string' })
  fullName: string;
  @Column({ type: 'string' })
  streetAddress: string;
  @Column({ type: 'string' })
  city: string;
  @Column({ type: 'string' })
  state: string;
  @Column({ type: 'string' })
  country: string;
  @Column({ type: 'string' })
  postalCode: string;
  @Column({ type: 'string' })
  phoneNumber: string;
}
