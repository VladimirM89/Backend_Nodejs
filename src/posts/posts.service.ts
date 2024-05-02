import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from 'src/auth/models/tokenPayload';
import { Role } from '@prisma/client';
import {
  CANNOT_DELETE_POST_ANOTHER_USER,
  CANNOT_UPDATE_POST_ANOTHER_USER,
  NOT_FOUND_POST,
} from 'src/constants/stringConstants';

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
      throw new BadRequestException(NOT_FOUND_POST);
    }
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    currentUser: TokenPayload,
  ) {
    const post = await this.findOne(id);

    const user = await this.usersService.findOneById(post.userId);

    if (user.id !== currentUser.id) {
      throw new ForbiddenException(CANNOT_UPDATE_POST_ANOTHER_USER);
    }

    return this.prisma.post.update({ where: { id }, data: updatePostDto });
  }

  async remove(id: string, currentUser: TokenPayload) {
    const post = await this.findOne(id);

    const user = await this.usersService.findOneById(post.userId);

    if (user && user.id !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException(CANNOT_DELETE_POST_ANOTHER_USER);
    }

    return this.prisma.post.delete({ where: { id }, select: { id: true } });
  }
}
