import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isEmail(value)) {
      throw new BadRequestException('Invalid email address');
    }
    return value;
  }
}
