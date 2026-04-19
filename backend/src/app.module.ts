import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';

@Module({
  imports: [UserModule, AuthModule, MenuModule, OrderModule, PaymentModule, KitchenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
