import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Body, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Req, 
  Res,
  ForbiddenException, 
  Logger 
} from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
} from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './payment.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
/**
 * 💳 PaymentController - CSR quầy quản lý Bill/Thanh toán
 * ✅ FIX #1 & #2: Thêm AuthGuard + RolesGuard + Fix logic tạo bill
 * - Chỉ CSR hoặc ADMIN mới được tạo/xử lý bill
 * - CSR chỉ được xử lý bill của mình
 * - Refund chỉ ADMIN
 */
@Controller('api/bills')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentController {
  private logger = new Logger('PaymentController');

  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles('CSR', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: any,
  ): Promise<Payment> {
    const csrId = req.user.id;
    const csrName = req.user.name;

    this.logger.log(
      `📄 CSR ${csrName} creating bill for order ${createPaymentDto.orderId}...`,
    );

    // ✅ FIX #1: Tự động lấy CSR info từ JWT token
    return this.paymentService.createPayment({
      ...createPaymentDto,
      csrId,
      csrName,
    });
  }

  @Get()
  @Roles('CSR', 'ADMIN') 
  async getAll(
    @Req() req: any,     
    @Query('skip') skip?: string,     
    @Query('take') take?: string,
    @Query('status') status?: PaymentStatus,
  ): Promise<{ data: Payment[]; total: number }> {
    this.logger.log(`Fetching bills for ${req.user.name} (role: ${req.user.role})`);
    
    return this.paymentService.getAllPayments(
      skip ? Number(skip) : 0,
      take ? Number(take) : 20,
      status,
    );
  }

  @Get(':id')
  @Roles('CSR', 'ADMIN')
  async getPaymentById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Payment> {
    this.logger.log(`👁️ CSR ${req.user.name} viewing bill ${id}`);
    return this.paymentService.getPaymentById(id);
  }

  @Get('order/:orderId')
  @Roles('CSR', 'ADMIN')
  async getPaymentByOrderId(
    @Param('orderId') orderId: string,
    @Req() req: any,
  ): Promise<Payment> {
    this.logger.log(`👁️ CSR ${req.user.name} viewing bill for order ${orderId}`);
    return this.paymentService.getPaymentByOrderId(orderId);
  }

  @Post(':id/payment')
  @Roles('CSR', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async processPayment(
    @Param('id') id: string,
    @Body() processPaymentDto: ProcessPaymentDto,
    @Req() req: any,
  ): Promise<Payment> {
    const payment = await this.paymentService.getPaymentById(id);

    // ✅ FIX #1: CSR chỉ xử lý thanh toán của chính mình
    if (payment.csrId !== req.user.id && req.user.role !== 'ADMIN') {
      this.logger.warn(
        `❌ CSR ${req.user.name} tried to process bill ${id} created by ${payment.csrName}`,
      );
      throw new ForbiddenException('Cannot process other CSR payments');
    }

    this.logger.log(
      `💰 CSR ${req.user.name} processing payment: ${processPaymentDto.amount}đ for bill ${id}`,
    );

    return this.paymentService.processPayment({
      ...processPaymentDto,
      paymentId: id,
    });
  }

  @Post(':id/refund')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async refundPayment(
    @Param('id') id: string,
    @Body() refundPaymentDto: RefundPaymentDto,
    @Req() req: any,
  ): Promise<Payment> {
    this.logger.log(
      `🔄 ADMIN ${req.user.name} refunding bill ${id}. Amount: ${refundPaymentDto.refundAmount}đ`,
    );

    return this.paymentService.refundPayment({
      ...refundPaymentDto,
      paymentId: id,
    });
  }

  @Get(':id/html')
  @Roles('CSR', 'ADMIN')
  async getBillHtml(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<string> {
    this.logger.log(`📰 CSR ${req.user.name} exporting bill ${id} as HTML`);
    return this.paymentService.generateBill(id);
  }

  @Get(':id/print')
  @Roles('CSR', 'ADMIN')
  async printBill(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<void> {
    this.logger.log(`🖨️ CSR ${req.user.name} printing bill ${id}`);

    const billHTML = await this.paymentService.generateBill(id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(billHTML);
  }
}
