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
  ForbiddenException, 
  Logger 
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  ConfirmOrderDto,
  CancelOrderDto,
  UpdateOrderStatusDto,
} from './dto/create-order.dto';
import { Order, OrderStatus } from './order.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

/**
 * 🏪 OrderController - CSR quầy quản lý Order
 * ✅ FIX #1: Thêm AuthGuard + RolesGuard
 * - Chỉ CSR hoặc ADMIN mới được tạo/sửa order
 * - CSR chỉ được sửa order của mình
 */
@Controller('api/orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrderController {
  private logger = new Logger('OrderController');

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles('CSR', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any,
  ): Promise<Order> {
    const csrId = req.user.id;
    const csrName = req.user.name;

    this.logger.log(`📝 CSR ${csrName} creating order...`);

    // ✅ FIX #1: Tự động lấy CSR info từ JWT token
    return this.orderService.createOrder({
      ...createOrderDto,
      csrId,
      csrName,
    });
  }

  @Get()
  @Roles('CSR', 'ADMIN')
  async getAllOrders(
    @Req() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: OrderStatus,
  ): Promise<{ data: Order[]; total: number }> {
    this.logger.log(`📋 Fetching orders for ${req.user.name} (role: ${req.user.role})`);

    return this.orderService.getAllOrders(
      skip ? Number(skip) : 0,
      take ? Number(take) : 20,
      status,
    );
  }

  @Get('unpaid')
  @Roles('CSR', 'ADMIN')
  async getUnpaidOrders(
    @Req() req: any,
  ): Promise<Order[]> {
    this.logger.log(`🔍 Fetching unpaid orders for ${req.user.name}`);
    return this.orderService.getUnpaidOrders();
  }

  @Get('table/:tableNumber')
  @Roles('CSR', 'ADMIN')
  async getOrdersByTable(
    @Param('tableNumber') tableNumber: string,
    @Req() req: any,
  ): Promise<Order[]> {
    this.logger.log(`🪑 Fetching orders for table ${tableNumber} by ${req.user.name}`);
    return this.orderService.getOrdersByTable(tableNumber);
  }

  @Get(':id')
  @Roles('CSR', 'ADMIN')
  async getOrderById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Order> {
    this.logger.log(`👁️ CSR ${req.user.name} viewing order ${id}`);
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  @Roles('CSR', 'ADMIN')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ): Promise<Order> {
    const order = await this.orderService.getOrderById(id);

    // ✅ FIX #1: CSR chỉ sửa được order của mình
    if (order.csrId !== req.user.id && req.user.role !== 'ADMIN') {
      this.logger.warn(
        `❌ CSR ${req.user.name} tried to edit order ${id} created by ${order.csrName}`,
      );
      throw new ForbiddenException('Cannot edit other CSR orders');
    }

    this.logger.log(`✏️ CSR ${req.user.name} updating order ${id}`);
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Put(':id/status')
  @Roles('CSR', 'ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: any,
  ): Promise<Order> {
    this.logger.log(
      `🔄 CSR ${req.user.name} updating order ${id} status to ${dto.status}`,
    );
    return this.orderService.updateOrderStatus(id, dto.status as OrderStatus);
  }

  @Post(':id/confirm')
  @Roles('CSR', 'ADMIN')
  async confirmOrder(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Order> {
    const order = await this.orderService.getOrderById(id);

    // ✅ FIX #1: CSR chỉ confirm order của mình
    if (order.csrId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot confirm other CSR orders');
    }

    this.logger.log(`✅ CSR ${req.user.name} confirming order ${id}`);
    return this.orderService.confirmOrder({ orderId: id });
  }

  @Post(':id/ready')
  @Roles('CSR', 'ADMIN', 'KITCHEN')
  async markOrderReady(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Order> {
    this.logger.log(`🍽️ ${req.user.name} marking order ${id} as ready`);
    return this.orderService.markOrderReady(id);
  }

  @Post(':id/complete')
  @Roles('CSR', 'ADMIN')
  async completeOrder(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Order> {
    const order = await this.orderService.getOrderById(id);

    if (order.csrId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot complete other CSR orders');
    }

    this.logger.log(`🏁 CSR ${req.user.name} completing order ${id}`);
    return this.orderService.completeOrder(id);
  }

  @Post(':id/cancel')
  @Roles('CSR', 'ADMIN')
  async cancelOrder(
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
    @Req() req: any,
  ): Promise<Order> {
    const order = await this.orderService.getOrderById(id);

    // ✅ FIX #1: CSR chỉ cancel order của mình
    if (order.csrId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot cancel other CSR orders');
    }

    this.logger.log(
      `❌ CSR ${req.user.name} cancelling order ${id}. Reason: ${cancelOrderDto.reason}`,
    );
    return this.orderService.cancelOrder({
      orderId: id,
      reason: cancelOrderDto.reason,
    });
  }
}
