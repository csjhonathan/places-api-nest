import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PlaceService } from "./place.service";
import { CreatePlaceDto } from "./dto/create-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";

@Controller("places")
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  index() {
    return this.placeService.index();
  }

  @Get(":id")
  show(@Param("id") id: string) {
    return this.placeService.show(+id);
  }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(+id, updatePlaceDto);
  }

  @Delete(":id")
  destroy(@Param("id") id: string) {
    return this.placeService.destroy(+id);
  }
}
