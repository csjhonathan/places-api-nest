import { faker } from "@faker-js/faker";
import { PrismaService } from "../../../../src/prisma/prisma.service";

export class DbPlaceFactorie {
  static create({ prisma, many }: { prisma: PrismaService; many?: number }) {
    if (many) {
      return prisma.place.createManyAndReturn({
        data: Array.from({ length: many })
          .fill("")
          .map(() => ({
            name: faker.company.name(),
            city: faker.location.city.name,
            state: faker.location.state.name,
          })),
      });
    }

    return prisma.place.create({
      data: {
        name: faker.company.name(),
        city: faker.location.city.name,
        state: faker.location.state.name,
      },
    });
  }

  static index(prisma: PrismaService) {
    return prisma.place.findMany();
  }

  static show({ prisma, id }: { prisma: PrismaService; id: number }) {
    return prisma.place.findUnique({
      where: {
        id,
      },
    });
  }
}
