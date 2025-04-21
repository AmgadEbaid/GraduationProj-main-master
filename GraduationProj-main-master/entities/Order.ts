import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'string' })
  name: string;
  @Column({ type: 'float', nullable: false })
  price: number;

  //   @OneToMany(()=>)
}
