import { faker } from "@faker-js/faker";
import { PrismaService } from "../../../../src/prisma/prisma.service";
import { Place } from "@prisma/client";

export class DbPlaceFactorie {
  static async create({
    prisma,
    many,
  }: {
    prisma: PrismaService;
    many: number;
  }): Promise<Place[]>;
  static async create({ prisma }: { prisma: PrismaService }): Promise<Place>;
  static async create({
    prisma,
    many,
  }: {
    prisma: PrismaService;
    many?: number;
  }): Promise<Place | Place[]> {
    if (many) {
      return prisma.place.createManyAndReturn({
        data: Array.from({ length: many }).map(() => ({
          name: faker.company.name(),
          city: faker.location.city(),
          state: faker.location.state(),
        })),
      });
    }

    return prisma.place.create({
      data: {
        name: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state(),
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
