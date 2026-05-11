import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import {
  CreateOrderDto,
  UpdateOrderDto,
  ConfirmOrderDto,
  CancelOrderDto,
} from './dto/create-order.dto';
import { MenuService } from '../menu/menu.service';
export enum OrderType {
  DINE_IN = 'dine-in',
  TAKEAWAY = 'takeaway',
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly menuService: MenuService,
  ) {}

  private resolveOrderItem(item: CreateOrderDto['items'][number]) {
    const itemId = item.menuItemId || item.productId;
    const itemName = item.menuItemName || item.productName;

    if (!itemId && !itemName) {
      throw new BadRequestException(
        'Mỗi item cần có productId/menuItemId hoặc productName/menuItemName',
      );
    }

    let unitPrice = item.unitPrice;
    let finalItemName = itemName;
    let finalItemId = itemId;

    if (itemId) {
      const catalogItem = this.menuService.getItemById(itemId);
      finalItemName = finalItemName || catalogItem.name;
      finalItemId = catalogItem.id;
      if (unitPrice === undefined || unitPrice === null) {
        unitPrice = catalogItem.price;
      }
    }

    if (unitPrice === undefined || unitPrice === null) {
      throw new BadRequestException(
        `Thiếu unitPrice cho item ${finalItemId || finalItemName}`,
      );
    }

    return {
      menuItemId: finalItemId || finalItemName || 'UNKNOWN',
      menuItemName: finalItemName || finalItemId || 'UNKNOWN',
      unitPrice,
    };
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    const normalizedItems = createOrderDto.items.map((item) => {
      const resolved = this.resolveOrderItem(item);
      const quantity = item.quantity;
      const subtotal = resolved.unitPrice * quantity;
      return {
        ...resolved,
        quantity,
        subtotal,
        notes: item.notes,
      };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1;
    const discountAmount =
      createOrderDto.discountAmount ??
      (createOrderDto.discountPercent ? subtotal * (createOrderDto.discountPercent / 100) : 0);
    const total = Math.max(0, subtotal + tax - discountAmount);

    const order = this.orderRepository.create({
      customerId: createOrderDto.customerId,
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      customerEmail: createOrderDto.customerEmail,
      tableNumber: createOrderDto.tableNumber,
      quantityPeople: createOrderDto.quantityPeople || 1,
      type: createOrderDto.type || OrderType.DINE_IN,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      notes: createOrderDto.notes,
      paymentMethod: createOrderDto.paymentMethod,
      csrId: createOrderDto.csrId,
      csrName: createOrderDto.csrName,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = normalizedItems.map((item) =>
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
        notes: item.notes,
        status: 'PENDING',
      }),
    );

    await this.orderItemRepository.save(orderItems);
    return this.getOrderById(savedOrder.id);
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'payments'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getAllOrders(
    skip: number = 0,
    take: number = 20,
    status?: OrderStatus,
  ): Promise<{ data: Order[]; total: number }> {
    const query = this.orderRepository.createQueryBuilder('order');

    if (status) {
      query.where('order.status = :status', { status });
    }

    const [data, total] = await query
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.payments', 'payments')
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { data, total };
  }

  // ✅ FIX #3: Khóa order sau khi có bill
  // Nếu order đã có bill (payment), không cho sửa
  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(id);

    // ✅ Kiểm tra nếu order đã có bill (payment) không null
    if (order.payments && order.payments.length > 0) {
      const activeBills = order.payments.filter(p => p.status !== 'CANCELLED');
      if (activeBills.length > 0) {
        throw new BadRequestException(
          'Cannot update order after bill has been created. Cancel bill first to edit order.'
        );
      }
    }

    const editableStatuses = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
    ];
    
    if (!editableStatuses.includes(order.status)) {
      throw new BadRequestException(
        'Cannot update order with status: ' + order.status,
      );
    }

    if (updateOrderDto.customerName !== undefined) order.customerName = updateOrderDto.customerName;
    if (updateOrderDto.customerPhone !== undefined) order.customerPhone = updateOrderDto.customerPhone;
    if (updateOrderDto.customerEmail !== undefined) order.customerEmail = updateOrderDto.customerEmail;
    if (updateOrderDto.tableNumber !== undefined) order.tableNumber = updateOrderDto.tableNumber;
    if (updateOrderDto.quantityPeople !== undefined) order.quantityPeople = updateOrderDto.quantityPeople;
    if (updateOrderDto.notes !== undefined) order.notes = updateOrderDto.notes;

    const discountAmount =
      updateOrderDto.discountAmount ??
      (updateOrderDto.discountPercent ? order.subtotal * (updateOrderDto.discountPercent / 100) : order.discount);
    order.discount = discountAmount;

    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      await this.orderItemRepository.delete({ orderId: id });

      const normalizedItems = updateOrderDto.items.map((item) => {
        const resolved = this.resolveOrderItem(item);
        const quantity = item.quantity;
        const subtotal = resolved.unitPrice * quantity;
        return {
          ...resolved,
          quantity,
          subtotal,
          notes: item.notes,
        };
      });

      const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = subtotal * 0.1;
      const total = Math.max(0, subtotal + tax - order.discount);

      order.subtotal = subtotal;
      order.tax = tax;
      order.total = total;

      const newItems = normalizedItems.map((item) =>
        this.orderItemRepository.create({
          orderId: id,
          menuItemId: item.menuItemId,
          menuItemName: item.menuItemName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
          notes: item.notes,
          status: 'PENDING',
        }),
      );
      await this.orderItemRepository.save(newItems);
    } else {
      order.total = Math.max(0, order.subtotal + order.tax - order.discount);
    }

    return this.orderRepository.save(order);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(id);
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.BILL_CREATED]: []
    };

    if (!allowed[order.status].includes(status)) {
      throw new BadRequestException(`Cannot update order from ${order.status} to ${status}`);
    }

    order.status = status;
    if (status === OrderStatus.COMPLETED) {
      order.completedAt = new Date();
    }
    return this.orderRepository.save(order);
  }

  async confirmOrder(confirmOrderDto: ConfirmOrderDto): Promise<Order> {
    return this.updateOrderStatus(confirmOrderDto.orderId, OrderStatus.CONFIRMED);
  }

  async markOrderReady(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, OrderStatus.PROCESSING);
  }

  async completeOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, OrderStatus.COMPLETED);
  }

  async cancelOrder(cancelOrderDto: CancelOrderDto): Promise<Order> {
    const order = await this.getOrderById(cancelOrderDto.orderId);

    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(`Cannot cancel order with status: ${order.status}`);
    }

    order.status = OrderStatus.CANCELLED;
    if (cancelOrderDto.reason) {
      order.notes = order.notes ? `${order.notes}
Hủy đơn: ${cancelOrderDto.reason}` : `Hủy đơn: ${cancelOrderDto.reason}`;
    }
    return this.orderRepository.save(order);
  }

  async getOrdersByTable(tableNumber: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        tableNumber,
        status: OrderStatus.PENDING,
      },
      relations: ['items', 'payments'],
    });
  }

  async getUnpaidOrders(): Promise<Order[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.payments', 'payments')
      .where(
        '(order.status = :completed OR order.status = :processing) AND (payments.id IS NULL OR payments.status <> :paidStatus)',
        {
          completed: OrderStatus.COMPLETED,
          processing: OrderStatus.PROCESSING,
          paidStatus: 'PAID',
        },
      )
      .orderBy('order.createdAt', 'ASC')
      .getMany();
  }
}
