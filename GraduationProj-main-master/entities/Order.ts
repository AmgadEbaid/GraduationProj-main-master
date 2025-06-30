import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';

export enum orderType {
  purchase = 'purchase',
  exchange = 'exchange',
  exchange_plus_cash = 'exchange_plus_cash',
}

export enum OrderStatus {
  PENDING = 'pending', // New order, awaiting payment or confirmation
  AWAITING_PAYMENT = 'awaiting_payment', // If payment is not immediate
  CONFIRMED = 'confirmed', // Order accepted, payment verified (if applicable)
  PROCESSING = 'processing', // Order is being prepared by the seller (items picked, etc.)
  AWAITING_SHIPMENT = 'awaiting_shipment', // Order is packed, labeled, ready for carrier pickup
  SHIPPED = 'shipped', // Order handed over to the carrier for delivery
  // After this, shippingStatus takes over for the journey.
  // Then, once shippingStatus.Delivered:
  COMPLETED = 'completed', // Order delivered and considered finished.
  PARTIALLY_SHIPPED = 'partially_shipped', // If an order can have multiple shipments
  RETURN_REQUESTED = 'return_requested', // Customer initiated a return
  RETURN_PROCESSING = 'return_processing', // Return received, being inspected
  RETURNED_COMPLETED = 'returned_completed', // Return fully processed (refund/exchange done)
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}
export enum paid_status {
  paid = 'paid',
  unpaid = 'unpaid',
}

export enum paymentMethod {
  cash = 'cash',
  card = 'card',
  wallet = 'wallet',
}

export enum shippingStatus {
  AWAITING_FULFILLMENT = 'Awaiting Fulfillment', // Seller needs to prepare the order for shipping
  LABEL_CREATED = 'Label Created', // Shipping label generated, package ready, awaiting carrier
  // Pending = 'Pending', // Could replace AWAITING_FULFILLMENT or LABEL_CREATED if you prefer fewer states
  DISPATCHED_FOR_PICKUP = 'Dispatched for Pickup', // Your existing good one
  PICKED_UP = 'Picked Up', // Value changed for consistency
  // ... rest of your good statuses, maybe with consistent casing for values if desired
  LEFT_CARRIER_LOCATION = 'Left Carrier Location',
  IN_TRANSIT = 'In Transit',
  ARRIVED_AT_LOCAL_DELIVERY_FACILITY = 'Arrived at Local Delivery Facility',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  AVAILABLE_FOR_PICKUP = 'Available for Pickup',
  DELIVERY_ATTEMPTED = 'Delivery Attempted',
  DELIVERED = 'Delivered',
  RETURNED_TO_SENDER = 'Returned to Sender', // Slightly more explicit than just "Returned"
  CANCELLED = 'Cancelled', // Value changed for consistency
  DELAYED = 'Delayed', // Value changed for consistency
  LOST = 'Lost', // Value changed for consistency

  // Or a slightly shorter version if you prefer:
  target_Product_DELIVERED__offered_Produc_PICKED_UP = 'P1 Delivered, P2 Pending Pickup',

  // Product2 (Customer -> Seller) Journey - after pickup from customer
  // Or more simply, if picked_up implies it's now in transit:
  // Then you might have:
  offeredProduc_IN_TRANSIT_TO_SELLER = 'Product2 In Transit to Seller', // If there's a distinct transit phase after pickup
  offeredProduc_ARRIVED_AT_SELLER_LOCAL_FACILITY = 'Product2 Arrived at Seller Local Facility',
  offeredProduc_OUT_FOR_DELIVERY_TO_SELLER = 'Product2 Out for Delivery to Seller',

  // -- Final Completion --
  // This is the new status indicating both parts of the exchange are complete.
  EXCHANGE_COMPLETED_ALL_PRODUCTS_DELIVERED = 'Exchange Completed - All Products Delivered',
}

@Entity({ name: 'orders' })
@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: orderType,
  })
  type: orderType;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: paymentMethod,
  })
  paymentMethod: paymentMethod;
  @Column({ type: 'float', nullable: true })
  cashAmount?: number;

  @Column({ type: 'int', default: 0 })
  usedPoints: number;
  @Column({ type: 'int', default: 0 })
  newPoints: number;

  @ManyToOne(() => User, (user) => user.deliveryOrders, { nullable: true })
  deliveryman: User;

  @Column({
    type: 'enum',
    enum: paid_status,
    default: paid_status.unpaid,
  })
  paidStatus: paid_status;
  @Column({
    type: 'enum',
    enum: shippingStatus,
    default: shippingStatus.AWAITING_FULFILLMENT,
  })
  shippingStatus: shippingStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date; // When the order was shipped
  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date; // When the order was confirmed by the seller
  @OneToOne(() => Product, { nullable: true })
  @JoinColumn()
  offeredProduct?: Product;
  @ManyToOne(() => User, (user) => user.orders)
  user: User;
  @OneToOne(() => Product)
  @JoinColumn()
  products: Product; // Assuming an order can have multiple products
}
