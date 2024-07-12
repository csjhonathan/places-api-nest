import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePlaceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "Museu do Amanhã",
    description: "This field requires a name to your place!",
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "Rio de Janeiro",
    description: "This field requires a city to your place!",
  })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "Rio de Janeiro",
    description: "This field requires a state to your place!",
  })
  state: string;
}
