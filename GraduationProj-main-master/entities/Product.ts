import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  //   @OneToMany(()=>)
}
