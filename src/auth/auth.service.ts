import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './models/tokenPayload';
import { TokensResponse } from './models/token';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, pass: string): Promise<TokensResponse> {
    const user = await this.validateUser(email, pass);

    const payload: TokenPayload = { id: user.id, email: user.email };
    const tokens = await this.generateTokens(payload);

    return tokens;
  }

  async register(newUser: RegisterAuthDto): Promise<User | TokensResponse> {
    const { email } = newUser;
    const existUser = await this.prisma.user.findUnique({ where: { email } });

    if (existUser) {
      throw new BadRequestException('User with this email already exist');
    }

    const userResponse = await this.usersService.create(newUser);

    return new User(userResponse);
  }

  async refresh(email: string, pass: string) {
    const user = await this.validateUser(email, pass);

    const payload: TokenPayload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  private async generateTokens(payload: TokenPayload): Promise<TokensResponse> {
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
      }),
    };
  }
}
