import { AppService } from './app.service';
import { AppController } from './app.controller';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './service/jwt.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:process.env.POSTGRES_HOST,
      port:parseInt(process.env.POSTGRES_PORT),
      username:process.env.POSTGRES_USER,
      password:process.env.POSTGRES_PASSWORD,
      database:process.env.POSTGRES_DATABASE,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
      entities:[UserEntity,ProfileEntity,BlogEntity,CommentEntity]
    }),
    UserModule,
    ProfileModule,
    BlogModule,
    CommentModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:process.env.JWT_EXPIREIN}
    })
  ],
  controllers: [AppController],
  providers: [AppService, EmailService,PasswordService,GlobalInterceptor,JwtAuthService],
})
export class AppModule {}
