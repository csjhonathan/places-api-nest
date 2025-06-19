import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreatePlaceDto } from "./dto/create-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";

@Injectable()
export class PlaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  index() {
    return this.prisma.place.findMany({
      where: {
        discarded_at: null,
      },
    });
  }

  create(createPlaceDto: CreatePlaceDto) {
    return this.prisma.place.create({
      data: createPlaceDto,
    });
  }

  show(id: number) {
    return this.prisma.place.findUnique({
      where: {
        id,
        discarded_at: null,
      },
    });
  }

  update(id: number, data: UpdatePlaceDto) {
    return this.prisma.place.update({
      where: {
        id,
      },
      data,
    });
  }

  destroy(id: number) {
    return this.prisma.place.update({
      where: {
        id,
      },
      data: {
        discarded_at: new Date(),
      },
    });
  }
}
