import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MenuModule } from './modules/menu/menu.module';
import { Order } from './modules/order/order.entity';
import { OrderItem } from './modules/order/order-item.entity';
import { Payment } from './modules/payment/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'restaurant_db'),
        entities: [Order, OrderItem, Payment],
        synchronize: configService.get('NODE_ENV', 'development') === 'development',
        logging: configService.get('NODE_ENV', 'development') === 'development',
      }),
    }),
    // ✅ FIX #1: Thêm AuthModule để export AuthGuard, RolesGuard
    AuthModule,
    MenuModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
