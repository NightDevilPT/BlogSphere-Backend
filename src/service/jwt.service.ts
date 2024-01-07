// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
	constructor(private readonly configService:ConfigService){}

  sign(payload: any): string {
    return jwt.sign(payload, this.configService.get("JWT_SECRET"), { expiresIn: this.configService.get("JWT_EXPIREIN") });
  }

  verify(token: string): any {
    return jwt.verify(token, this.configService.get("JWT_SECRET"));
  }
}
