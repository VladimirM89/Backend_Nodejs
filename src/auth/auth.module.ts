import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' }, // e.g. 30s, 7d, 24h
    }),
  ],
})
export class AuthModule {}
