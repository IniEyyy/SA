import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAllCategories() {
    return this.prisma.category.findMany({ orderBy: { id: "asc" } });
  }

  async findProductsByCategory(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category ${categoryId} not found`);
    return this.prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { id: "asc" },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new BadRequestException(
        `Category ${dto.categoryId} does not exist`
      );
    }
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        imageUrl: dto.imageUrl ?? null,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
    return { message: "Product created successfully", product };
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Category ${dto.categoryId} does not exist`
        );
      }
    }
    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
    return { message: "Product updated successfully", product };
  }

  async reduceStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    if (quantity > product.stock) {
      throw new BadRequestException(
        `Insufficient stock for "${product.name}". Requested: ${quantity}, Available: ${product.stock}`
      );
    }
    const updated = await this.prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
      include: { category: true },
    });
    return { message: "Stock reduced successfully", product: updated };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: "Product deleted successfully" };
  }
}
