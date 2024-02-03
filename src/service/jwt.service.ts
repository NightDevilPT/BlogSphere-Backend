// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  sign(payload: any): Promise<string> {
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn:this.configService.get<string>("JWT_EXPIREIN")
    });
    return token;
  }

  verify(token: string): Promise<{ id: string }> {
    return this.jwtService.verifyAsync(token);
  }
}
