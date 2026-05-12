import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UserRole } from '../user/user-role.enum';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
} from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './payment.entity';
import { PaymentService } from './payment.service';

const BILL_ACCESS_ROLES = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.CASHIER,
  UserRole.SERVER,
];

@Controller('api/bills')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(...BILL_ACCESS_ROLES)
  @HttpCode(HttpStatus.CREATED)
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Payment> {
    return this.paymentService.createPayment({
      ...createPaymentDto,
      csrId: user.id,
      csrName: user.fullName,
    });
  }

  @Get()
  @Roles(...BILL_ACCESS_ROLES)
  async getAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: PaymentStatus,
  ): Promise<{ data: Payment[]; total: number }> {
    return this.paymentService.getAllPayments(
      skip ? Number(skip) : 0,
      take ? Number(take) : 20,
      status,
    );
  }

  @Get(':id')
  @Roles(...BILL_ACCESS_ROLES)
  async getPaymentById(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.getPaymentById(id);
  }

  @Get('order/:orderId')
  @Roles(...BILL_ACCESS_ROLES)
  async getPaymentByOrderId(@Param('orderId') orderId: string): Promise<Payment> {
    return this.paymentService.getPaymentByOrderId(orderId);
  }

  @Post(':id/payment')
  @Roles(...BILL_ACCESS_ROLES)
  @HttpCode(HttpStatus.OK)
  async processPayment(
    @Param('id') id: string,
    @Body() processPaymentDto: ProcessPaymentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Payment> {
    await this.assertCanMutatePayment(id, user);
    return this.paymentService.processPayment({
      ...processPaymentDto,
      paymentId: id,
    });
  }

  @Post(':id/refund')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async refundPayment(
    @Param('id') id: string,
    @Body() refundPaymentDto: RefundPaymentDto,
  ): Promise<Payment> {
    return this.paymentService.refundPayment({
      ...refundPaymentDto,
      paymentId: id,
    });
  }

  @Get(':id/html')
  @Roles(...BILL_ACCESS_ROLES)
  async getBillHtml(@Param('id') id: string): Promise<string> {
    return this.paymentService.generateBill(id);
  }

  @Get(':id/print')
  @Roles(...BILL_ACCESS_ROLES)
  async printBill(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const billHTML = await this.paymentService.generateBill(id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(billHTML);
  }

  private async assertCanMutatePayment(
    paymentId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const canManageAllPayments =
      user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;

    if (canManageAllPayments) {
      return;
    }

    const payment = await this.paymentService.getPaymentById(paymentId);

    if (payment.csrId !== user.id) {
      throw new ForbiddenException('You can only process your own bills.');
    }
  }
}
