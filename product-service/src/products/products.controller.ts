import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ProductsService } from "./products.service";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "List all products (public)" })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a product by id (public)" })
  @ApiResponse({ status: 404, description: "Product not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}
