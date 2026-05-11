import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Order } from '../order/order.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
}

export enum PaymentStatus {
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  billNumber: string;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;

  @Column()
  orderId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.ISSUED,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  transactionId?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  remainingAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  changeAmount: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  csrId?: string;

  @Column({ nullable: true })
  csrName?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ type: 'date', nullable: true })
  billDate?: string;

  @Column({ type: 'date', nullable: true })
  dueDate?: string;

  @Column('longtext', { nullable: true })
  paymentHistory?: string;

  @Column('longtext', { nullable: true })
  invoiceContent?: string;
}
