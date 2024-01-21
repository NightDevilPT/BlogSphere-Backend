// src/profile/dto/profile-create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class ProfileCreateDTO {
  @ApiProperty({ description: 'The first name of the user', required: true })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'The last name of the user', required: true })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'The gender of the user', required: true, enum: ['male', 'female', 'other'] })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ description: 'The avatar URL of the user', required: true })
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @ApiProperty({ description: 'The update date of the profile', required: false, default: new Date().getTime() })
  createdAt?: string;

  @ApiProperty({ description: 'The update date of the profile', required: false, default: new Date().getTime() })
  updatedAt?: string;
}