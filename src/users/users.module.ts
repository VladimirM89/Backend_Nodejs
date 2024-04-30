import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RolesGuard],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
