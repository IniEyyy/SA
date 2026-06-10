import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class AddItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}
