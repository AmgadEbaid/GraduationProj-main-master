import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { PaymentMethod, PaymentStatus } from "./Repair";

export enum DeliveryStatus {
    Pending = 'pending',
    onDelivering = 'onDelivering',
    Delivered = 'delivered',
}

export enum DeliveryType {
    Receive = 'receive',
    Deliver = 'deliver'
}

@Entity()
export class Delivery {
    
    @PrimaryGeneratedColumn('uuid')
    deliveryId: string;

    @Column({ nullable: false })
    productType: string;

    @Column({ nullable: false })
    imageUrl: string;
    
    @Column({ nullable: true })
    cost: number;
    
    @Column({ nullable: true })
    deliveryDays: number;

    @Column({ 
        type: 'enum',
        enum: DeliveryType,
        default: DeliveryType.Receive
    })
    deliveryType: DeliveryType;
    
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
    
    @ManyToOne(() => User, (user) => user.deliveries)
    user: User;
    @ManyToOne(() => User, (user) => user.deliveries)
    workshop: User;
    @ManyToOne(() => User, (user) => user.deliveries)
    @JoinColumn({ name: "deliveryComId" })
    delivery: User;
}