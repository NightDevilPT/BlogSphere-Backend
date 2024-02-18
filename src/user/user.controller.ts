import { Controller, Post, Body, Query, Put, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { EmailValidationPipe } from 'src/pipe/email-validation/email-validation.pipe';
import { UserUpdateDTO } from './dto/user-update.dto';
import { GlobalInterceptor } from 'src/interceptors/guard.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get-user')
  @UseInterceptors(GlobalInterceptor)
  findOne(@Body() user:any) {
    return this.userService.getUserData(user.user.id);
  }

  @Post('/create')
  create(@Body() createUserDto: UserCreateDTO): any {
    return this.userService.create(createUserDto);
  }

  @Put('/verify')
  verify(@Query('token') token: string): any {
    return this.userService.verifyEmail(token);
  }

  @Put('/send-link')
  sendUpdatePasswordLink(
    @Query('email', new EmailValidationPipe()) email: string,
    @Query('linkType') linkType: string,
  ): any {
    return this.userService.sendTokenLink(email,linkType);
  }

  @Put('/update-password')
  updatePassword(
    @Body() updateUserDto: UserUpdateDTO,
    @Query('token') token: string,
  ): any {
    return this.userService.updatePassword(updateUserDto.password, token);
  }

  @Post('/login')
  login(
    @Body('email', new EmailValidationPipe()) email: string,
    @Body('password') password: string,
  ): any {
    return this.userService.login(email, password);
  }

  @Put('/update')
  update(@Body() updateUserDto: UserUpdateDTO): any {
    return;
  }
}
