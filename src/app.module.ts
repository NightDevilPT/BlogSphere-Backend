import { AppService } from './app.service';
import { AppController } from './app.controller';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { BlogEntity } from './blog/entities/blog.entity';
import { ProfileModule } from './profile/profile.module';
import { UserEntity } from './user/entities/user.entity';
import { CommentModule } from './comment/comment.module';
import { EmailService } from './service/email-service.service';
import { ProfileEntity } from './profile/entities/profile.entity';
import { CommentEntity } from './comment/entities/comment.entity';
import { PasswordService } from './service/password-service.service';
import { GlobalInterceptor } from './interceptors/guard.interceptor';
import { JwtService } from './service/jwt.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL, // Use POSTGRES_URL for connection
      synchronize: true, // set to true for development, false for production
      autoLoadEntities: true,
      logging:true,
      ssl:true,
      entities:[UserEntity,ProfileEntity,BlogEntity,CommentEntity]
    }),
    UserModule,
    ProfileModule,
    BlogModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService,PasswordService,GlobalInterceptor,JwtService],
})
export class AppModule {}
