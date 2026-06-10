import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductsService } from "./products.service";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "List all categories (public)" })
  findAll() {
    return this.productsService.findAllCategories();
  }

  @Get(":categoryId/products")
  @ApiOperation({ summary: "List products in a category (public)" })
  findByCategory(@Param("categoryId", ParseIntPipe) categoryId: number) {
    return this.productsService.findProductsByCategory(categoryId);
  }
}
