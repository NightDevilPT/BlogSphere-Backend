import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PasswordService } from 'src/service/password-service.service';
import { EmailService } from 'src/service/email-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailValidationPipe } from 'src/pipe/email-validation/email-validation.pipe';
import { JwtAuthService } from 'src/service/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { GlobalInterceptor } from 'src/interceptors/guard.interceptor';
import { ProfileEntity } from 'src/profile/entities/profile.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,ProfileEntity]),ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserService,PasswordService,EmailService,EmailValidationPipe,JwtAuthService,JwtService,ConfigService,GlobalInterceptor],
})
export class UserModule {}
