import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProductsController } from './products.controller';
import { CategoriesController } from './categories.controller';
import { AdminProductsController } from './admin-products.controller';
import { ProductsService } from './products.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, PassportModule],
  controllers: [
    ProductsController,
    CategoriesController,
    AdminProductsController,
  ],
  providers: [ProductsService, JwtStrategy],
})
export class ProductsModule {}
