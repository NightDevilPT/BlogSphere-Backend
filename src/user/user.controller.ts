import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { EmailService } from 'src/service/email-service.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,private readonly emailService: EmailService) {}

  @Post('/create')
  create(@Body() createUserDto: UserCreateDTO):any {
    return this.userService.create(createUserDto);  
  }

  @Put('/verify')
  verify(@Query('token') token:string ):any {
    return this.userService.verifyEmail(token);
  }
}
