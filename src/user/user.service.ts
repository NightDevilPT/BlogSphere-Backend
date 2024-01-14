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
import { UserUpdateDTO } from './dto/user-update.dto';


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
  ) { }

  async create(createUserDto: UserCreateDTO): Promise<userReturnType> {
    try {
      const token = createUserDto.provider !== "google" ? await this.passwordService.hashPassword(`${new Date().getTime()}`) : null
      const userData = {
        ...createUserDto,
        password: await this.passwordService.hashPassword(createUserDto.password),
        token: token,
        provider: createUserDto.provider ? createUserDto.provider : 'local'
      };

      const user = this.userRepository.create(userData);
      const saved = await this.userRepository.save(user);
      if (saved.provider === 'local') {
        const sendMail = await this.emailService.sendVerificationLink(
          user.email,
          user.username,
          `${this.configService.get<string>('ORIGIN')}/user/verify?token=${token}`,
        );
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

  async googleAuth(token:string):Promise<userReturnType>{
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
      const jwt = this.jwtService.sign({ id: user.id })

      return { id: user.id, jwt, message: 'Email verification successful' };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new GoneException('Token has expired');
      } else {
        throw new GoneException('Invalid token');
      }
    }
  }

  async sendUpdatePasswordLink(email:string):Promise<userReturnType>{
    try{
      const user = await this.userRepository.findOne({ where: { email } });
      if(!user){
        throw new NotFoundException("User not found")
      }

      const token = await this.passwordService.hashPassword(`${new Date().getTime()}`)
      user.token = token;
      const updateToken = await this.userRepository.save(user);
      const sendMail = await this.emailService.sendUpdatePasswordLink(
        updateToken.email,
        updateToken.username,
        `${this.configService.get<string>('ORIGIN')}/user/update-password?token=${token}`,
      );
      return {message:`update password linked sended to ${updateToken.email}`}
    }catch(err){
      console.log(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException("User not found")
      }
      throw new InternalServerErrorException("Internal Server Error")
    }
  }

  async updatePassword(password:string,token:string):Promise<userReturnType>{
    try {
      if (!token) {
        throw new BadRequestException('Invalid Token');
      }

      const user = await this.userRepository.findOne({ where: { token } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update the user's email verification status
      user.verified = true;
      user.token = null; // Optional: Clear the verification token
      user.password = await this.passwordService.hashPassword(password),
      await this.userRepository.save(user);
      const jwt = this.jwtService.sign({ id: user.id })

      return { id: user.id, jwt, message: 'Password successfully updated' };
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw new GoneException(err.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async login(email:string,password:string):Promise<userReturnType>{
    try{
      const user = await this.userRepository.findOne({where:{email}});
      if(!user){
        throw new NotFoundException('User not fount')
      }
      const compare = await this.passwordService.comparePassword(password,user.password);
      if(!compare){
        throw new NotFoundException('Invalid email or password');
      }

      const jwt = this.jwtService.sign({ id: user.id })
      return { id: user.id, jwt, message: 'successfully logined.' };
    }catch(err){
      if(err instanceof NotFoundException){
        throw new NotFoundException(err.message);
      }
    }
  }
}
