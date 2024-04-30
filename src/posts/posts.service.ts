import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from 'src/auth/models/tokenPayload';
import { Role } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto, currentUserId: string) {
    return this.prisma.post.create({
      data: { ...createPostDto, userId: currentUserId },
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new BadRequestException('No post with this id');
    }
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    currentUser: TokenPayload,
  ) {
    const post = await this.findOne(id);
    if (!post) {
      throw new BadRequestException('No post with this id');
    }

    const user = await this.usersService.findOne(post.userId);

    if (user.id !== currentUser.id) {
      throw new ForbiddenException('You cannot update another author post');
    }

    return this.prisma.post.update({ where: { id }, data: updatePostDto });
  }

  async remove(id: string, currentUser: TokenPayload) {
    const post = await this.findOne(id);
    if (!post) {
      throw new BadRequestException('No found post with this id');
    }

    const user = await this.usersService.findOne(post.userId);

    if (user && user.id !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot delete another author post');
    }

    return this.prisma.post.delete({ where: { id }, select: { id: true } });
  }
}
