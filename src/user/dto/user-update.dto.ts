// src/user/dto/user-update.dto.ts
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class UserUpdateDTO {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  token?: string;
}
