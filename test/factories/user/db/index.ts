import { faker } from "@faker-js/faker";
import { PrismaService } from "@/prisma/prisma.service";
import { EncryptionHelper } from "@/helpers/libs/encryption";
import { CreateUserDto } from "@/user/dto/create-user.dto";

export class DbUserFactorie {
  static create(prisma: PrismaService) {
    return prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password(),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  static createEncrypted({
    prisma,
    user,
  }: {
    prisma: PrismaService;
    user: CreateUserDto;
  }) {
    return prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: EncryptionHelper.hashData({
          raw_data: user.password,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  static show({ prisma, email }: { prisma: PrismaService; email: string }) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
