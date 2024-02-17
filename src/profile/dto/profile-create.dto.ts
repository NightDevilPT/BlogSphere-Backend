// src/profile/dto/profile-create.dto.ts
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class ProfileCreateDTO {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  image: string;
  
  @IsDate()
  @IsOptional()
  createdAt?: string;

  @IsDate()
  @IsOptional()
  updatedAt?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  twitter?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  youtube?: string;
}