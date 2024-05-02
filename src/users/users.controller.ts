import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/libs/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Roles } from 'src/libs/decorators/userRole.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { CurrentUser } from 'src/libs/decorators/currentUser.decorator';
import { TokenPayload } from 'src/auth/models/tokenPayload';
import {
  CANNOT_SHOW_ANOTHER_USER,
  CANNOT_UPDATE_ANOTHER_USER,
  CANNOT_DELETE_ANOTHER_USER,
} from 'src/constants/stringConstants';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new User(user));
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const user = await this.usersService.findOneById(id);

    this.usersService.checkUserPermissions(
      id,
      currentUser,
      CANNOT_SHOW_ANOTHER_USER,
    );

    return new User(user);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: TokenPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.findOneById(id);

    this.usersService.checkUserPermissions(
      id,
      currentUser,
      CANNOT_UPDATE_ANOTHER_USER,
    );

    const userWithPassword = await this.usersService.update(id, updateUserDto);
    return new User(userWithPassword);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    await this.usersService.findOneById(id);

    this.usersService.checkUserPermissions(
      id,
      currentUser,
      CANNOT_DELETE_ANOTHER_USER,
    );

    return this.usersService.remove(id);
  }
}
