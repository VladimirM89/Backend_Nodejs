import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Role } from '@prisma/client';

export class User {
  @IsUUID(4)
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
