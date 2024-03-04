import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { GlobalInterceptor } from 'src/interceptors/guard.interceptor';
import { JwtAuthService } from 'src/service/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { PaginationService } from 'src/service/pagination.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity,BlogEntity]), ConfigModule.forRoot()],
  controllers: [BlogController],
  providers: [
    BlogService,
    GlobalInterceptor,
    JwtAuthService,
    JwtService,
    PaginationService,
    ConfigService,
    ProfileEntity,
  ],
})
export class BlogModule {}
