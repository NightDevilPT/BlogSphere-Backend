import {
  BadRequestException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserCreateDTO } from './dto/user-create.dto';
import { PasswordService } from 'src/service/password-service.service';
import { EmailService } from 'src/service/email-service.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/service/jwt.service';

import * as jwt from 'jsonwebtoken';


interface userReturnType {
  id?: string;
  jwt?: string;
  message?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: UserCreateDTO): Promise<userReturnType> {
    try {
      const token = createUserDto.provider!=="google"?await this.passwordService.hashPassword(`${new Date().getTime()}`):null
      const userData = {
        ...createUserDto,
        password: await this.passwordService.hashPassword(createUserDto.password),
        token: token,
        provider:createUserDto.provider?createUserDto.provider:'local'
      };

      const user = this.userRepository.create(userData);
      const saved = await this.userRepository.save(user);
      console.log(saved,'----saved');

      if (user.provider === 'local') {
        const sendMail = await this.emailService.sendVerificationLink(
          user.email,
          user.username,
          `${this.configService.get<string>('ORIGIN')}/user/verify?token=${token}`,
        );
        console.log(sendMail,'----sendmail')
        return { message: `Verification link sent to ${user.email}` };
      } else {
        return { id: user.id, jwt: 'email', message: 'Done' };
      }
    } catch (err) {
      if (err instanceof QueryFailedError && err.message.includes('duplicate key')) {
        throw new GoneException('User with this email or username already exists');
      }
      throw new InternalServerErrorException(err.message || 'Internal server error occurred');
    }
  }

  // user.service.ts
async verifyEmail(token: string): Promise<userReturnType> {
  try {
    if (!token) {
      throw new BadRequestException('Token is required for email verification');
    }

    const user = await this.userRepository.findOne({where:{token}});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user's email verification status
    user.verified = true;
    user.token = null; // Optional: Clear the verification token
    await this.userRepository.save(user);
    const jwt = this.jwtService.sign({id:user.id})

    return { id: user.id, jwt, message: 'Email verification successful' };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new GoneException('Token has expired');
    } else {
      throw new GoneException('Invalid token');
    }
  }
}

}
