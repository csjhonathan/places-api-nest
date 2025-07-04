import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class TestHelpers {
  static async cleanDb(prisma: PrismaService) {
    await prisma.user.deleteMany({});
    await prisma.place.deleteMany({});
  }
}
