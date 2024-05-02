import { PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';

export class LoginAuthDto extends PickType(Auth, [
  'email',
  'password',
] as const) {}
