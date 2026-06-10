import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import {
  IsLettersOnly,
  HasNoSpaces,
  HasMinDigits,
  HasAllowedEmailDomain,
} from '../../common/validator';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @IsLettersOnly({ message: 'First name must contain letters only' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @IsLettersOnly({ message: 'Last name must contain letters only' })
  lastName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @HasAllowedEmailDomain(['.com', '.net', '.org', '.id'])
  email: string;

  @ApiProperty({ example: 'secret12', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @HasNoSpaces({ message: 'Password cannot contain spaces' })
  @HasMinDigits(2, { message: 'Password must contain at least 2 digits' })
  password: string;
}
