import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class ReduceStockDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  quantity: number;
}
