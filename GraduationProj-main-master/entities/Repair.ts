import { Entity ,Column, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

export enum RepairStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Fullfilled = 'fullfilled',
    cancelled = 'cancelled'
}

@Entity()
export class Repair {
    @PrimaryGeneratedColumn('uuid')
    repairId: string;

    @Column({
        type: 'enum',
        enum: RepairStatus,
        default: RepairStatus.Pending,
        nullable: false
    })
    status: RepairStatus;

    @Column({ default: new Date().toLocaleString() })
    createdAt: string

    @Column({ default: new Date().toLocaleString() })
    updatedAt: string

    // relations
    @ManyToOne(() => User, (user) => user.repair)
    user: User;
    @ManyToOne(() => User, (user) => user.repair)
    workshop: User;
    @OneToMany(() => Product, (product) => product.repair)
    products: Product[]
}