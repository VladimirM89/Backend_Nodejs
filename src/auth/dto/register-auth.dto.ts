import { OmitType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';

export class RegisterAuthDto extends OmitType(Auth, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
