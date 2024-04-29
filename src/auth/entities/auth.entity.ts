import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';

export class Auth {
  @IsUUID(4)
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  //TODO add role
  @IsOptional()
  role?: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
