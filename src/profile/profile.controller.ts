import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Req,
  Put,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GlobalInterceptor } from 'src/interceptors/guard.interceptor';
import { ProfileCreateDTO } from './dto/profile-create.dto';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.getProfileByIdWithUser(id);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.profileService.findAll(page, limit);
  }

  @Post('create')
  @UseInterceptors(GlobalInterceptor)
  create(
    @Body() createProfileDto: ProfileCreateDTO,
    @Req() req: Request & { user?: any },
  ): any {
    return this.profileService.create(createProfileDto, req.user?.id);
  }

  @Put(':id')
  @UseInterceptors(GlobalInterceptor)
  update(@Param('id') id: string, @Body() updateProfileDto: any) {
    return this.profileService.update(id, updateProfileDto);
  }
}
