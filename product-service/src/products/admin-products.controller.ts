import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ReduceStockDto } from "./dto/reduce-stock.dto";
import { AuthGuard } from "./auth.guard";
import { AdminGuard } from "./admin.guard";

@ApiTags("Admin Products")
@ApiBearerAuth()
@Controller("admin/products")
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: "Create a product (admin only)" })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post(":id/update")
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: "Update a product (admin only)" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Post(":id/reduce")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Reduce product stock (authenticated, also used by checkout)",
  })
  @ApiResponse({ status: 400, description: "Insufficient stock" })
  reduce(@Param("id", ParseIntPipe) id: number, @Body() dto: ReduceStockDto) {
    return this.productsService.reduceStock(id, dto.quantity);
  }

  @Post(":id/delete")
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: "Delete a product (admin only)" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
