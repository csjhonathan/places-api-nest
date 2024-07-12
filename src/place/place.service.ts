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

  async update(id: number, updatePlaceDto: UpdatePlaceDto) {
    await this.checkPlace(id);
    return this.placeRepository.update(id, updatePlaceDto);
  }

  async destroy(id: number) {
    await this.checkPlace(id);
    return this.placeRepository.destroy(id);
  }

  private async checkPlace(id: number) {
    if (isNaN(id) || !id) {
      throw new UnprocessableEntityException("Id must be a number!");
    }

    const place = await this.placeRepository.show(id);

    if (!place) {
      throw new NotFoundException(
        "This place doesn't exists or must be deleted!",
      );
    }

    return place;
  }
}
