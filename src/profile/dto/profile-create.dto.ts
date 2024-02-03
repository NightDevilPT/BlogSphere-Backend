// src/profile/dto/profile-create.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';


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
  avatar: string;

  createdAt?: string;

  updatedAt?: string;
}