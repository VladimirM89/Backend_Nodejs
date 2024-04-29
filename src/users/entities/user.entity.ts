import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class User {
  @IsUUID(4)
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  //TODO add role
  @IsOptional()
  role: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
