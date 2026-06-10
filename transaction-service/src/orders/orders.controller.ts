import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { AuthGuard } from "./auth.guard";

function extractToken(req: any): string {
  return req.headers["authorization"].split(" ")[1];
}

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: "Checkout: place an order from the current cart" })
  @ApiResponse({
    status: 400,
    description: "Cart is empty or insufficient stock",
  })
  checkout(@Request() req: any) {
    return this.ordersService.checkout(req.user.id, extractToken(req));
  }

  @Get()
  @ApiOperation({ summary: "List the current user orders" })
  getMyOrders(@Request() req: any) {
    return this.ordersService.getMyOrders(req.user.id);
  }

  @Post(":id")
  @ApiOperation({ summary: "Fetch a single order with product details" })
  @ApiResponse({ status: 403, description: "Cannot view another user order" })
  getOrderDetail(@Param("id", ParseIntPipe) id: number, @Request() req: any) {
    return this.ordersService.getOrderDetail(
      id,
      req.user.id,
      extractToken(req)
    );
  }
}
