import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";
import { PaymentMethod, PaymentStatus } from "./Repair";

export enum DeliveryStatus {
    Pending = 'pending',
    Proposed = 'proposed',
    onDelivering = 'onDelivering',
    Delivered = 'delivered',
    Rejected = 'rejected'
}

@Entity()
export class Delivery {
    
    @PrimaryGeneratedColumn('uuid')
    deliveryId: string;

    @Column()
    title: string;

    @Column({ nullable: false })
    recipientName: string;

    @Column({ nullable: false })
    recipientPhone: string;

    @Column({ nullable: false })
    address: string;
    
    @Column({ nullable: true })
    cost: number;
    
    @Column({ nullable: true })
    deliveryDays: number;
    
    @Column({
        type: 'enum',
        enum: DeliveryStatus,
        default: DeliveryStatus.Pending
    })
    status: DeliveryStatus;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.Unpaid,
        nullable: false
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.Card,
        nullable: false
    })
    paymentMethod: PaymentMethod;

    @Column({ default: new Date().toLocaleString() })
    createAt: string;

    @Column({ default: new Date().toLocaleString() })
    updateAt: string;

    // Relations
    @OneToMany(() => Product, (product) => product.delivery)
    products: Product[];
    @ManyToOne(() => User, (user) => user.deliveries)
    delivery: User;
    @ManyToOne(() => User, (user) => user.deliveries)
    workshop: User;
}