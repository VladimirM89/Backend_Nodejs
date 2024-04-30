import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { RolesGuard } from 'src/libs/guards/roles.guard';

@Module({
  controllers: [PostsController],
  providers: [PostsService, UsersService, RolesGuard],
  imports: [PrismaModule],
  exports: [PostsService],
})
export class PostsModule {}
