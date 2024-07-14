import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { EncryptionHelper } from "../helpers/libs/encryption";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: EncryptionHelper.hashData(createUserDto.password),
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
