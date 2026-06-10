import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrdersModule,
    CartsModule,
  ],
})
export class AppModule {}
