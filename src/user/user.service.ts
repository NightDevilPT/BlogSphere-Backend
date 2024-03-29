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

import * as jwt from 'jsonwebtoken';
import { JwtAuthService } from 'src/service/jwt.service';
import { ProfileEntity } from 'src/profile/entities/profile.entity';

interface userReturnType {
  id?: string;
  jwt?: string;
  message?: string;
  status?: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtAuthService,
  ) {}

  async create(createUserDto: UserCreateDTO): Promise<userReturnType> {
    try {
      if (createUserDto.provider === 'local') {
        const token = await this.passwordService.hashPassword(
          `${new Date().getTime()}`,
        );
        const userData = {
          ...createUserDto,
          password: await this.passwordService.hashPassword(
            createUserDto.password,
          ),
          token: token,
          provider: createUserDto.provider ? createUserDto.provider : 'local',
        };

        const user = this.userRepository.create(userData);
        const saved = await this.userRepository.save(user);
        const sendMail = await this.emailService.sendVerificationLink(
          user.email,
          user.username,
          `${this.configService.get<string>(
            'ORIGIN',
          )}/auth/verify?token=${token}`,
        );
        return { message: `Verification link sent to ${user.email}` };
      } else {
        const findUser = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });
        if (findUser) {
          const token = await this.jwtService.sign({ id: findUser.id });
          return {
            id: findUser.id,
            jwt: token,
            message: 'successfully logined',
          };
        } else {
          const userData = {
            ...createUserDto,
            verified: true,
          };
          const user = this.userRepository.create(userData);
          const saved = await this.userRepository.save(user);

          if (saved) {
            const jwt = await this.jwtService.sign({ id: findUser.id });
            return { id: findUser.id, jwt, message: 'Done' };
          }
        }
      }
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.message.includes('duplicate key')
      ) {
        throw new GoneException(
          'User with this email or username already exists',
        );
      }
      throw new InternalServerErrorException(
        err.message || 'Internal server error occurred',
      );
    }
  }

  async getUserData(id: any): Promise<UserEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    const findProfile = await this.filterProfileData(id)
    return {
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
      verified: findUser.verified,
      profile: findProfile,
    } as UserEntity;
  }

  // user.service.ts
  async verifyEmail(token: string): Promise<userReturnType> {
    try {
      if (!token) {
        throw new NotFoundException('Invalid Token');
      }

      const user = await this.userRepository.findOne({ where: { token } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update the user's email verification status
      user.verified = true;
      user.token = null; // Optional: Clear the verification token
      await this.userRepository.save(user);

      return { message: 'Email verification successful' };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async googleAuth(token: string): Promise<userReturnType> {
    try {
      if (!token) {
        throw new GoneException('Invalid token');
      }

      const user = await this.userRepository.findOne({ where: { token } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update the user's email verification status
      user.verified = true;
      user.token = null; // Optional: Clear the verification token
      await this.userRepository.save(user);
      const jwt = await this.jwtService.sign({ id: user.id });

      return { id: user.id, jwt, message: 'Email verification successful' };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new GoneException('Token has expired');
      } else {
        throw new GoneException('Invalid token');
      }
    }
  }

  async sendTokenLink(
    email: string,
    linkType: string,
  ): Promise<userReturnType> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = await this.passwordService.hashPassword(
        `${new Date().getTime()}`,
      );
      user.token = token;
      const updateToken = await this.userRepository.save(user);
      if (linkType === 'resend') {
        await this.emailService.sendVerificationLink(
          updateToken.email,
          updateToken.username,
          `${this.configService.get<string>(
            'ORIGIN',
          )}/auth/verify?token=${token}`,
        );
      } else {
        await this.emailService.sendUpdatePasswordLink(
          updateToken.email,
          updateToken.username,
          `${this.configService.get<string>(
            'ORIGIN',
          )}/auth/update-password?token=${token}`,
        );
      }
      return {
        message:
          linkType === 'resend'
            ? `verification link sent to ${updateToken.email}`
            : `update password linked sended to ${updateToken.email}`,
      };
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updatePassword(
    password: string,
    token: string,
  ): Promise<userReturnType> {
    try {
      if (!token) {
        throw new BadRequestException('Invalid Token');
      }

      const user = await this.userRepository.findOne({ where: { token } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.token = null; // Optional: Clear the verification token
      user.password = await this.passwordService.hashPassword(password);
      user.updatedAt = `${new Date().getTime()}`;
      await this.userRepository.save(user);

      return { message: 'Password successfully updated' };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw new GoneException(err.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async login(email: string, password: string): Promise<userReturnType> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not fount');
      }
      if (!user.verified) {
        throw new NotFoundException('email not verified');
      }
      const compare = await this.passwordService.comparePassword(
        password,
        user.password,
      );
      if (!compare) {
        throw new NotFoundException('Invalid email or password');
      }

      const jwt = await this.jwtService.sign({ id: user.id });
      return { id: user.id, jwt, message: 'successfully logined.' };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async filterProfileData(id:string){
    return await this.profileRepository
    .createQueryBuilder('profile')
    .leftJoin('profile.user', 'user') // Use leftJoin instead of leftJoinAndSelect
    .where('user.id = :userId', { userId: id })
    .getOne();
  }
}
