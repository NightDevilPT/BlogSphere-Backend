import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { GlobalInterceptor } from 'src/interceptors/guard.interceptor';
import { JwtService } from 'src/service/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProfileEntity]),ConfigModule.forRoot()],
  controllers: [ProfileController],
  providers: [ProfileService,GlobalInterceptor,JwtService,ConfigService],
})
export class ProfileModule {}
