import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserRepository {
  private PASSWORD_SHUFFLE = 10;

  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(
          createUserDto.password,
          this.PASSWORD_SHUFFLE,
        ),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  show(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
        discarded_at: null,
      },
    });
  }

  showByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
        discarded_at: null,
      },
    });
  }
}
