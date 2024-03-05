import { ConfigModule } from '@nestjs/config';
import { BlogEntity } from './blog/entities/blog.entity';
import { CommentEntity } from './comment/entities/comment.entity';
import { ProfileEntity } from './profile/entities/profile.entity';
import { UserEntity } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { JwtModule } from '@nestjs/jwt';
import { PaginationService } from './service/pagination.service';
import { JwtAuthService } from './service/jwt.service';
import { GlobalInterceptor } from './interceptors/guard.interceptor';
import { PasswordService } from './service/password-service.service';
import { EmailService } from './service/email-service.service';
import { AppService } from './app.service';

export const AllEntities = [
  UserEntity,
  ProfileEntity,
  BlogEntity,
  CommentEntity,
];

export const AllModules = [
  ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    ssl: { rejectUnauthorized: false },
    entities: [...AllEntities],
  }),
  UserModule,
  ProfileModule,
  BlogModule,
  CommentModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIREIN },
  }),
];

export const AllProviders = [
  AppService,
  EmailService,
  PasswordService,
  GlobalInterceptor,
  JwtAuthService,
  PaginationService,
];
