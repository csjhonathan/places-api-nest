import { faker } from "@faker-js/faker";
import { PrismaService } from "../../../../src/prisma/prisma.service";
import { EncryptionHelper } from "../../../../src/helpers/libs/encryption";
import { User } from "@prisma/client";

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

  static createEncrypted(prisma: PrismaService, user: User) {
    return prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: EncryptionHelper.hashData(user.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
