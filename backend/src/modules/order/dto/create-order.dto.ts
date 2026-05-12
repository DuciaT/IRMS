import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsPositive,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';
import { OrderType } from '../order-type.enum';

export class CreateOrderItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  menuItemId?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  menuItemName?: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  tableNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantityPeople?: number;

  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['CASH', 'CARD', 'BANK_TRANSFER', 'CHEQUE'])
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  csrId?: string;

  @IsOptional()
  @IsString()
  csrName?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  tableNumber?: string;

  @IsOptional()
  @IsNumber()
  quantityPeople?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class ConfirmOrderDto {
  @IsString()
  orderId: string;
}

export class CancelOrderDto {
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
