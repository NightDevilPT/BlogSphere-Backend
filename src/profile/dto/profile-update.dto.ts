import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @ApiProperty({ description: 'The first name of the user', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstname?: string;

  @ApiProperty({ description: 'The last name of the user', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastname?: string;

  @ApiProperty({ description: 'The gender of the user', required: false, enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'The avatar URL of the user', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatar?: string;
}
