// src/user/dto/user-create.dto.ts
import { IsNotEmpty, IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UserCreateDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  verified: boolean;

  
  @IsOptional()
  @IsString()
  provider: string;
}
