import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { GlobalInterceptor } from 'src/interceptors/guard.interceptor';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { JwtAuthService } from 'src/service/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { PaginationService } from 'src/service/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity]), ConfigModule.forRoot()],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    GlobalInterceptor,
    JwtAuthService,
    JwtService,
    PaginationService,
  ],
})
export class ProfileModule {}
