import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;
    const hashedPassword = await this.hashPassword(password);

    return this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ include: { posts: true } });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      const hashedPassword = await this.hashPassword(password);
      return this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto, password: hashedPassword },
      });
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id }, select: { id: true } });
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword: string = await bcrypt.hash(
      password,
      Number(process.env.CRYPT_SALT),
    );

    return hashedPassword;
  }
}
