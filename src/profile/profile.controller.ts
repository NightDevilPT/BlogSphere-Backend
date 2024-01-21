import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, BadRequestException, ValidationPipe, UsePipes, Put } from '@nestjs/common';
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
  findAll() {
    return this.profileService.findAll();
  }

  @Post('create')
  @UseInterceptors(GlobalInterceptor)
  create(@Body() createProfileDto: ProfileCreateDTO,@Req() req: Request) {
    return this.profileService.create(createProfileDto,req.body?.user?.id);
  }


  @Put(':id')
  @UseInterceptors(GlobalInterceptor)
  update(@Param('id') id: string, @Body() updateProfileDto: any) {
    return this.profileService.update(id, updateProfileDto);
  }
}
