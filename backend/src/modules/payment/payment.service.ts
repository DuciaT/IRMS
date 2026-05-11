import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { OrderStatus } from '../order/order.entity';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
} from './dto/create-payment.dto';
import { Order } from '../order/order.entity';
import { OrderService } from '../order/order.service';

interface PaymentHistoryEntry {
  date: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private orderService: OrderService,
  ) {}

  private parseHistory(payment?: Payment): PaymentHistoryEntry[] {
    if (!payment?.paymentHistory) {
      return [];
    }

    try {
      const parsed = JSON.parse(payment.paymentHistory);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private serializeHistory(history: PaymentHistoryEntry[]): string {
    return JSON.stringify(history);
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const order = await this.orderService.getOrderById(createPaymentDto.orderId);

    const existingPayment = await this.paymentRepository.findOne({
      where: { orderId: createPaymentDto.orderId },
    });

    if (existingPayment && existingPayment.status !== PaymentStatus.CANCELLED) {
      throw new BadRequestException('Order already has a bill');
    }

    const totalAmount = Number(order.total);
    const initialPaidAmount = createPaymentDto.paidAmount ? Number(createPaymentDto.paidAmount) : 0;

    if (initialPaidAmount < 0) {
      throw new BadRequestException('Paid amount must be greater than or equal to 0');
    }
    if (initialPaidAmount > totalAmount) {
      throw new BadRequestException(
        `Paid amount (${initialPaidAmount}) cannot exceed order total (${totalAmount})`,
      );
    }

    const remainingAmount = totalAmount - initialPaidAmount;
    const billNumber = await this.generateBillNumber();
    const history: PaymentHistoryEntry[] = [];

    if (initialPaidAmount > 0) {
      history.push({
        date: new Date().toISOString(),
        amount: initialPaidAmount,
        method: createPaymentDto.paymentMethod,
        transactionId: createPaymentDto.transactionId,
        notes: createPaymentDto.notes,
      });
    }

    const payment = this.paymentRepository.create({
      billNumber,
      orderId: createPaymentDto.orderId,
      amount: totalAmount,
      method: createPaymentDto.paymentMethod,
      status: remainingAmount === 0 ? PaymentStatus.PAID : PaymentStatus.ISSUED,
      transactionId: createPaymentDto.transactionId,
      amountPaid: initialPaidAmount,
      remainingAmount,
      changeAmount: 0,
      notes: createPaymentDto.notes,
      csrId: createPaymentDto.csrId,
      csrName: createPaymentDto.csrName,
      billDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      paymentHistory: this.serializeHistory(history),
    });

    const savedPayment = await this.paymentRepository.save(payment);

    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `Cannot create bill for order with status ${order.status}`,
      );
    }
    
    order.status =
      remainingAmount === 0
        ? OrderStatus.COMPLETED
        : OrderStatus.BILL_CREATED;
    
    if (remainingAmount === 0) {
      order.completedAt = new Date();
    }
    
    await this.orderRepository.save(order);

    return this.getPaymentById(savedPayment.id);
  }

  async processPayment(processPaymentDto: ProcessPaymentDto & { paymentId?: string }): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: processPaymentDto.paymentId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment with ID ${processPaymentDto.paymentId} not found`,
      );
    }

    if (payment.status !== PaymentStatus.ISSUED) {
      throw new BadRequestException(
        `Cannot process payment with status: ${payment.status}`,
      );
    }

    const amount = Number(processPaymentDto.amount ?? 0);
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    if (amount > payment.remainingAmount) {
      throw new BadRequestException(
        `Số tiền vượt quá nợ còn lại (${payment.remainingAmount})`,
      );
    }

    const history = this.parseHistory(payment);
    history.push({
      date: new Date().toISOString(),
      amount,
      method: processPaymentDto.paymentMethod,
      transactionId: processPaymentDto.transactionId,
      notes: processPaymentDto.notes,
    });

    payment.amountPaid = Number(payment.amountPaid) + amount;
    payment.remainingAmount = Number(payment.amount) - payment.amountPaid;
    payment.method = processPaymentDto.paymentMethod;
    payment.transactionId = processPaymentDto.transactionId;
    payment.notes = processPaymentDto.notes ?? payment.notes;
    payment.paymentHistory = this.serializeHistory(history);
    payment.status = payment.remainingAmount === 0 ? PaymentStatus.PAID : PaymentStatus.ISSUED;
    payment.completedAt = payment.remainingAmount === 0 ? new Date() : payment.completedAt;

    const savedPayment = await this.paymentRepository.save(payment);

    const order = await this.orderRepository.findOne({ where: { id: payment.orderId } });
    if (order && savedPayment.status === PaymentStatus.PAID) {
      order.status = OrderStatus.COMPLETED;
      order.completedAt = new Date();
      await this.orderRepository.save(order);
    }

    return savedPayment;
  }

  async refundPayment(refundPaymentDto: RefundPaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: refundPaymentDto.paymentId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment with ID ${refundPaymentDto.paymentId} not found`,
      );
    }

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException(
        `Can only refund paid bills. Current status: ${payment.status}`,
      );
    }

    const refundAmount = refundPaymentDto.refundAmount || payment.amount;

    if (refundAmount > payment.amountPaid) {
      throw new BadRequestException(
        `Refund amount (${refundAmount}) cannot exceed paid amount (${payment.amountPaid})`,
      );
    }

    const order = await this.orderRepository.findOne({
      where: { id: payment.orderId },
    });
    
    if (order) {
      order.status = OrderStatus.BILL_CREATED;
      order.completedAt = undefined;
      await this.orderRepository.save(order);
    }

    payment.status = PaymentStatus.ISSUED;
    payment.amountPaid = Number(payment.amountPaid) - refundAmount;
    payment.remainingAmount = Number(payment.amount) - payment.amountPaid;
    payment.notes = `Refunded: ${refundAmount}. Reason: ${refundPaymentDto.reason || 'No reason provided'}`;

    return this.paymentRepository.save(payment);
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { orderId },
      relations: ['order', 'order.items'],
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment for order ${orderId} not found`,
      );
    }

    return payment;
  }

  async generateBill(paymentId: string): Promise<string> {
    const payment = await this.getPaymentById(paymentId);
    const order = await this.orderRepository.findOne({
      where: { id: payment.orderId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    const history = this.parseHistory(payment);
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .invoice-container { max-width: 720px; margin: auto; border: 1px solid #ddd; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h2 { margin: 0; font-size: 20px; }
          .bill-info { font-size: 12px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
          th { background: #f5f5f5; }
          .total-section { text-align: right; font-size: 14px; }
          .total-row { font-size: 18px; font-weight: bold; margin-top: 8px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          .history { margin-top: 20px; }
          .status-paid { color: green; font-weight: bold; }
          .status-issued { color: orange; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h2>HÓA ĐƠN THANH TOÁN</h2>
            <div>Mã bill: ${payment.billNumber}</div>
            <div class="${payment.status === 'PAID' ? 'status-paid' : 'status-issued'}">
              Trạng thái: ${payment.status === 'PAID' ? '✅ ĐÃ THANH TOÁN' : '⏳ CHỜ THANH TOÁN'}
            </div>
          </div>

          <div class="bill-info">
            <div><strong>Khách hàng:</strong> ${order.customerName || 'Khách lẻ'}</div>
            <div><strong>SĐT:</strong> ${order.customerPhone || '-'}</div>
            <div><strong>Email:</strong> ${order.customerEmail || '-'}</div>
            <div><strong>CSR:</strong> ${payment.csrName || payment.csrId || '-'}</div>
            <div><strong>Ngày lập:</strong> ${payment.billDate || new Date().toISOString().slice(0, 10)}</div>
            <div><strong>Hạn thanh toán:</strong> ${payment.dueDate || '-'}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Món</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item) => `
                <tr>
                  <td>${item.menuItemName}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${Number(item.unitPrice).toLocaleString('vi-VN')}đ</td>
                  <td style="text-align: right;">${Number(item.subtotal).toLocaleString('vi-VN')}đ</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <p>Tạm tính: <span>${Number(order.subtotal).toLocaleString('vi-VN')}đ</span></p>
            <p>VAT (10%): <span>${Number(order.tax).toLocaleString('vi-VN')}đ</span></p>
            ${Number(order.discount) > 0 ? `<p>Chiết khấu: <span>-${Number(order.discount).toLocaleString('vi-VN')}đ</span></p>` : ''}
            <p class="total-row">Tổng cộng: ${Number(order.total).toLocaleString('vi-VN')}đ</p>
            <p>Đã thanh toán: <span>${Number(payment.amountPaid).toLocaleString('vi-VN')}đ</span></p>
            <p>Còn lại: <span>${Number(payment.remainingAmount).toLocaleString('vi-VN')}đ</span></p>
          </div>

          <div class="history">
            <strong>Lịch sử thanh toán:</strong>
            <ul>
              ${history.map((entry) => `
                <li>${new Date(entry.date).toLocaleString('vi-VN')} - ${Number(entry.amount).toLocaleString('vi-VN')}đ - ${entry.method}${entry.notes ? ` - ${entry.notes}` : ''}</li>
              `).join('') || '<li>Chưa có thanh toán</li>'}
            </ul>
          </div>

          <div class="footer">
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Thời gian in: ${new Date().toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    payment.invoiceContent = invoiceHTML;
    await this.paymentRepository.save(payment);

    return invoiceHTML;
  }

  private async generateBillNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const latestBill = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('DATE(payment.createdAt) = CURDATE()')
      .orderBy('payment.billNumber', 'DESC')
      .limit(1)
      .getOne();

    let sequence = 1;
    if (latestBill) {
      const lastNumber = parseInt(latestBill.billNumber.split('-')[2], 10);
      sequence = Number.isNaN(lastNumber) ? 1 : lastNumber + 1;
    }

    return `BILL-${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }

  async getAllPayments(
    skip: number = 0,
    take: number = 20,
    status?: PaymentStatus,
  ): Promise<{ data: Payment[]; total: number }> {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (status) {
      query.where('payment.status = :status', { status });
    }

    const [data, total] = await query
      .leftJoinAndSelect('payment.order', 'order')
      .orderBy('payment.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { data, total };
  }
}
