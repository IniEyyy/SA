import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AddItemDto } from "./dto/add-item.dto";
import { UpdateQuantityDto } from "./dto/update-quantity.dto";

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL ?? "http://localhost:3002";

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  private async fetchProduct(productId: number, token: string) {
    const res = await fetch(`${PRODUCT_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new BadRequestException(`Product ${productId} not found`);
    return res.json();
  }

  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }
    return cart;
  }

  private async buildCartView(userId: number, token: string) {
    const cart = await this.getOrCreateCart(userId);
    const items = [];
    let total = 0;
    for (const item of cart.items) {
      const product = await this.fetchProduct(item.productId, token);
      const subtotal = product.price * item.quantity;
      total += subtotal;
      items.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl ?? null,
        quantity: item.quantity,
        subtotal,
      });
    }
    return { cartId: cart.id, userId, items, total };
  }

  getCart(userId: number, token: string) {
    return this.buildCartView(userId, token);
  }

  async addItem(userId: number, dto: AddItemDto, token: string) {
    const product = await this.fetchProduct(dto.productId, token);
    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity exceeds stock. Available: ${product.stock}`
      );
    }
    const cart = await this.getOrCreateCart(userId);
    const existing = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: dto.productId },
      },
    });
    if (existing) {
      throw new BadRequestException("Product already exists in the cart");
    }
    await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
    return this.buildCartView(userId, token);
  }

  async updateQuantity(
    userId: number,
    productId: number,
    dto: UpdateQuantityDto,
    token: string
  ) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!item) throw new NotFoundException("Item not in cart");
    const product = await this.fetchProduct(productId, token);
    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity exceeds stock. Available: ${product.stock}`
      );
    }
    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });
    return this.buildCartView(userId, token);
  }

  async removeItem(userId: number, productId: number, token: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!item) throw new NotFoundException("Item not in cart");
    await this.prisma.cartItem.delete({ where: { id: item.id } });
    return this.buildCartView(userId, token);
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { message: "Cart cleared successfully" };
  }
}
