import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL ?? "http://localhost:3002";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private async fetchProduct(productId: number, token: string) {
    const res = await fetch(`${PRODUCT_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new BadRequestException(`Product ${productId} not found`);
    return res.json();
  }

  private async reduceStock(
    productId: number,
    quantity: number,
    token: string
  ) {
    const res = await fetch(
      `${PRODUCT_URL}/admin/products/${productId}/reduce`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new BadRequestException(
        body?.message ?? `Failed to reduce stock for product ${productId}`
      );
    }
  }

  async checkout(userId: number, token: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    const details = [];
    for (const item of cart.items) {
      const product = await this.fetchProduct(item.productId, token);
      if (item.quantity > product.stock) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Requested: ${item.quantity}, Available: ${product.stock}`
        );
      }
      details.push({
        productId: item.productId,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await this.prisma.order.create({
      data: { userId, details: { create: details } },
      include: { details: true },
    });

    for (const item of cart.items) {
      await this.reduceStock(item.productId, item.quantity, token);
    }

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return { message: "Order placed successfully", order };
  }

  getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { details: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getOrderDetail(id: number, userId: number, token: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { details: true },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId) {
      throw new ForbiddenException("You can only view your own orders");
    }

    const details = [];
    for (const d of order.details) {
      const product = await this.fetchProduct(d.productId, token);
      details.push({
        productId: d.productId,
        name: product.name,
        price: d.price,
        quantity: d.quantity,
        subtotal: d.price * d.quantity,
      });
    }
    return {
      id: order.id,
      userId: order.userId,
      createdAt: order.createdAt,
      details,
    };
  }
}
