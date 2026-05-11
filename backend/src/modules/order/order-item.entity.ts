import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { Order } from './order.entity';
  
  @Entity('order_items')
  export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    menuItemId: string; // ID món ăn
  
    @Column()
    menuItemName: string; // Tên món ăn
  
    @Column('decimal', { precision: 8, scale: 2 })
    unitPrice: number; // Giá đơn vị
  
    @Column({ default: 1 })
    quantity: number; // Số lượng
  
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number; // Tổng tiền cho item này (unitPrice * quantity)
  
    @Column({ nullable: true })
    notes?: string; // Ghi chú (không nước, ít đường, v.v)
  
    @Column({ nullable: true })
    status?: string; // Status của item (pending, preparing, ready)
  
    @ManyToOne(() => Order, (order) => order.items, {
      onDelete: 'CASCADE',
    })
    order: Order;
  
    @Column()
    orderId: string;
  }