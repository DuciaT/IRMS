import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UserRole } from '../user/user-role.enum';
import { OrderService } from './order.service';
import {
  CancelOrderDto,
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './dto/create-order.dto';
import { Order, OrderStatus } from './order.entity';

const ORDER_ACCESS_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.SERVER];
const ORDER_KITCHEN_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.CHEF];

@Controller('api/orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(...ORDER_ACCESS_ROLES)
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Order> {
    return this.orderService.createOrder({
      ...createOrderDto,
      csrId: user.id,
      csrName: user.fullName,
    });
  }

  @Get()
  @Roles(...ORDER_ACCESS_ROLES)
  async getAllOrders(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: OrderStatus,
  ): Promise<{ data: Order[]; total: number }> {
    return this.orderService.getAllOrders(
      skip ? Number(skip) : 0,
      take ? Number(take) : 20,
      status,
    );
  }

  @Get('unpaid')
  @Roles(...ORDER_ACCESS_ROLES)
  async getUnpaidOrders(): Promise<Order[]> {
    return this.orderService.getUnpaidOrders();
  }

  @Get('table/:tableNumber')
  @Roles(...ORDER_ACCESS_ROLES)
  async getOrdersByTable(
    @Param('tableNumber') tableNumber: string,
  ): Promise<Order[]> {
    return this.orderService.getOrdersByTable(tableNumber);
  }

  @Get(':id')
  @Roles(...ORDER_ACCESS_ROLES)
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  @Roles(...ORDER_ACCESS_ROLES)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Order> {
    await this.assertCanMutateOrder(id, user);
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Put(':id/status')
  @Roles(...ORDER_ACCESS_ROLES)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Order> {
    await this.assertCanMutateOrder(id, user);
    return this.orderService.updateOrderStatus(id, dto.status);
  }

  @Post(':id/confirm')
  @Roles(...ORDER_ACCESS_ROLES)
  async confirmOrder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Order> {
    await this.assertCanMutateOrder(id, user);
    return this.orderService.confirmOrder({ orderId: id });
  }

  @Post(':id/ready')
  @Roles(...ORDER_KITCHEN_ROLES)
  async markOrderReady(@Param('id') id: string): Promise<Order> {
    return this.orderService.markOrderReady(id);
  }

  @Post(':id/complete')
  @Roles(...ORDER_ACCESS_ROLES)
  async completeOrder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Order> {
    await this.assertCanMutateOrder(id, user);
    return this.orderService.completeOrder(id);
  }

  @Post(':id/cancel')
  @Roles(...ORDER_ACCESS_ROLES)
  async cancelOrder(
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Order> {
    await this.assertCanMutateOrder(id, user);
    return this.orderService.cancelOrder({
      orderId: id,
      reason: cancelOrderDto.reason,
    });
  }

  private async assertCanMutateOrder(
    orderId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const canManageAllOrders =
      user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;

    if (canManageAllOrders) {
      return;
    }

    const order = await this.orderService.getOrderById(orderId);

    if (order.csrId !== user.id) {
      throw new ForbiddenException('You can only modify your own orders.');
    }
  }
}
