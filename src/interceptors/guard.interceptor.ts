import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from 'src/service/jwt.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      return throwError(() => new UnauthorizedException('Invalid Token'));
    }

    try {
      const decoded = this.jwtService.verify(token);
      if (!decoded) {
        return throwError(() => new UnauthorizedException('Invalid Token'));
      }

      request.body.user = decoded;

      return next.handle().pipe(
        catchError((err) => {
          return throwError(() => new BadRequestException(err.message));
        }),
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      return throwError(() => new UnauthorizedException('Invalid Token'));
    }
  }

  private extractTokenFromHeader(authorizationHeader: string | undefined): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer.trim().toLowerCase() !== 'bearer' || !token) {
      return null;
    }

    return token;
  }
}