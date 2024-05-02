import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { JwtGuard } from 'src/libs/guards/jwt-auth.guard';
import { CurrentUser } from 'src/libs/decorators/currentUser.decorator';
import { TokenPayload } from 'src/auth/models/tokenPayload';
import { Role } from '@prisma/client';
import { Roles } from 'src/libs/decorators/userRole.decorator';
import { RolesGuard } from 'src/libs/guards/roles.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.postsService.create(createPostDto, currentUserId);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    return this.postsService.update(id, updatePostDto, currentUser);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    return this.postsService.remove(id, currentUser);
  }
}
