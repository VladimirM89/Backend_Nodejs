import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './models/tokenPayload';
import { TokensResponse } from './models/token';
import { RegisterAuthDto } from './dto/registerAuth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import {
  INCORRECT_PASSWORD,
  USER_WITH_EMAIL_EXIST,
} from 'src/constants/stringConstants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(userEmail: string, userPass: string): Promise<TokensResponse> {
    const user = await this.validateUser(userEmail, userPass);
    const { id, email, role } = user;

    const payload: TokenPayload = { id, email, role };
    const tokens = await this.generateTokens(payload);

    return tokens;
  }

  async register(newUser: RegisterAuthDto): Promise<User | TokensResponse> {
    const { email } = newUser;
    const existUser = await this.prisma.user.findUnique({ where: { email } });

    if (existUser) {
      throw new BadRequestException(USER_WITH_EMAIL_EXIST);
    }

    const userResponse = await this.usersService.create(newUser);

    return new User(userResponse);
  }

  async refresh(userEmail: string, userPass: string) {
    const user = await this.validateUser(userEmail, userPass);
    const { id, email, role } = user;

    const payload: TokenPayload = { id, email, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(INCORRECT_PASSWORD);
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
