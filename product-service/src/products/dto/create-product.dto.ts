import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  Max,
  MinLength,
} from "class-validator";
import { HasMinWords } from "../../common/validators";

export class CreateProductDto {
  @ApiProperty({ example: "Iced Caramel Macchiato" })
  @IsString()
  @IsNotEmpty()
  @HasMinWords(3, { message: "Product name must contain at least 3 words" })
  name: string;

  @ApiProperty({
    example: "A smooth espresso layered with milk, ice, and caramel drizzle.",
  })
  @IsString()
  @MinLength(20, { message: "Description must be at least 20 characters" })
  description: string;

  @ApiProperty({ example: 5 })
  @IsInt({ message: "Price must be an integer" })
  @Min(1, { message: "Price must be at least 1" })
  price: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  @Max(999, { message: "Stock must be between 0 and 999" })
  stock: number;

  @ApiPropertyOptional({ example: "https://example.com/macchiato.jpg" })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  categoryId: number;
}
