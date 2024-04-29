import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './models/tokenPayload';
import { Token } from './models/token';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, pass: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user?.password !== pass) {
      throw new NotFoundException('User not exist');
    }

    const isPasswordValid = user.password === pass;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: TokenPayload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(newUser: RegisterAuthDto) {
    const { email } = newUser;
    const existUser = await this.prisma.user.findUnique({ where: { email } });

    if (existUser) {
      throw new BadRequestException('User with this email already exist');
    }

    return this.usersService.create(newUser);
  }
}
