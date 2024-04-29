import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    JwtStrategy,
    RefreshJwtStrategy,
    RefreshJwtGuard,
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class AuthModule {}
