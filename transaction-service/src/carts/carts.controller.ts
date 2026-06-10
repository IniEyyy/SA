import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CartsService } from "./carts.service";
import { AddItemDto } from "./dto/add-item.dto";
import { UpdateQuantityDto } from "./dto/update-quantity.dto";
import { AuthGuard } from "../orders/auth.guard";

function extractToken(req: any): string {
  return req.headers["authorization"].split(" ")[1];
}

@ApiTags("Cart")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("cart")
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: "Retrieve the current user cart" })
  getCart(@Request() req: any) {
    return this.cartsService.getCart(req.user.id, extractToken(req));
  }

  @Post()
  @ApiOperation({ summary: "Add an item to the cart" })
  addItem(@Body() dto: AddItemDto, @Request() req: any) {
    return this.cartsService.addItem(req.user.id, dto, extractToken(req));
  }

  @Post("clear")
  @ApiOperation({ summary: "Clear all items from the cart" })
  clearCart(@Request() req: any) {
    return this.cartsService.clearCart(req.user.id);
  }

  @Post(":product_id/update")
  @ApiOperation({ summary: "Update an item quantity in the cart" })
  updateQuantity(
    @Param("product_id", ParseIntPipe) productId: number,
    @Body() dto: UpdateQuantityDto,
    @Request() req: any
  ) {
    return this.cartsService.updateQuantity(
      req.user.id,
      productId,
      dto,
      extractToken(req)
    );
  }

  @Post(":product_id/delete")
  @ApiOperation({ summary: "Remove an item from the cart" })
  removeItem(
    @Param("product_id", ParseIntPipe) productId: number,
    @Request() req: any
  ) {
    return this.cartsService.removeItem(
      req.user.id,
      productId,
      extractToken(req)
    );
  }
}
