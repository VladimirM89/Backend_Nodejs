import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class User {
  @IsUUID(4)
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  //TODO add role
  @IsOptional()
  role: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
