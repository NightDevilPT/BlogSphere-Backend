import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PasswordService } from 'src/service/password-service.service';
import { EmailService } from 'src/service/email-service.service';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from 'src/service/jwt.service';
import { EmailValidationPipe } from 'src/pipe/email-validation/email-validation.pipe';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),ConfigModule.forRoot(),],
  controllers: [UserController],
  providers: [UserService,PasswordService,EmailService,JwtService,EmailValidationPipe],
})
export class UserModule {}
