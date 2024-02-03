// src/blog/dto/blog.dto.ts

import { IsString, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class BlogDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  
  title: string;

  @IsArray()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  data: string;
}
