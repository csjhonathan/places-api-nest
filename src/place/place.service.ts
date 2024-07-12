import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreatePlaceDto } from "./dto/create-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";
import { PlaceRepository } from "./place.repository";

@Injectable()
export class PlaceService {
  constructor(private readonly placeRepository: PlaceRepository) {}

  index() {
    return this.placeRepository.index();
  }

  async show(id: number) {
    return this.checkPlace(id);
  }

  create(createPlaceDto: CreatePlaceDto) {
    return this.placeRepository.create(createPlaceDto);
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    this.checkPlace(id);
    return this.placeRepository.update(id, updatePlaceDto);
  }

  destroy(id: number) {
    this.checkPlace(id);
    return this.placeRepository.destroy(id);
  }

  private async checkPlace(id: number) {
    if (isNaN(id) || !id) {
      throw new UnprocessableEntityException({
        message: "Id must be a number!",
      });
    }

    const place = await this.placeRepository.show(id);

    if (!place) {
      throw new NotFoundException({
        message: "This place doesn't exists or must be deleted!",
      });
    }

    return place;
  }
}
