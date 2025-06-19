import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { PlaceService } from "./place.service";
import { CreatePlaceDto } from "./dto/create-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { PlaceHelpers } from "@/helpers/place";
import { CurrentUser } from "@/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { JWTAuthGuard } from "@/guards/jwt.guard";

@ApiTags("places")
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: "Unauthorized, you need to provide a valid token!",
})
@Controller("places")
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  @ApiOperation({ summary: "Provides a list with all places!" })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "You received a list with all places, or empty array if theres no exists places!",
    content: {
      "application/json": {
        example: {
          places: [
            PlaceHelpers.getPlaceExample(),
            PlaceHelpers.getPlaceExample(),
            PlaceHelpers.getPlaceExample(),
            PlaceHelpers.getPlaceExample(),
          ],
        },
      },
    },
  })

  //METHOD
  async index(@CurrentUser() user: User) {
    console.log("user :>> ", user);
    const places = await this.placeService.index();
    return { places };
  }

  @Get(":id")
  @ApiOperation({ summary: "Provides a unique place!" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "You received one place by requested place id!",
    content: {
      "application/json": {
        example: {
          place: PlaceHelpers.getPlaceExample(),
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "The requested place not exists in database!",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Place id is not a number!",
  })

  //METHOD
  async show(@Param("id") id: string) {
    const place = await this.placeService.show(+id);
    return { place };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a place!" })
  @ApiBody({ type: CreatePlaceDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Your have a required field problem!",
  })

  //METHOD
  async create(@Body() createPlaceDto: CreatePlaceDto) {
    const place = await this.placeService.create(createPlaceDto);
    return { place };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update a place!" })
  @ApiBody({ type: CreatePlaceDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Your have a required field problem!",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Place id doesn't exists or has been deleted!",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Place id is not a number!",
  })

  //METHOD
  async update(
    @Param("id") id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    const place = await this.placeService.update(+id, updatePlaceDto);
    return { place };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Soft delete a place!" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Place deleted!",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Place id doesn't exists or has been deleted!",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Place id is not a number!",
  })

  //METHOD
  async destroy(@Param("id") id: string) {
    const place = await this.placeService.destroy(+id);
    return { place };
  }
}
