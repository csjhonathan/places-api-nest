import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "My name",
    description: "This field requires an user!",
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: "some@email.com",
    description: "This field requires an user!",
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "123123",
    description: "This field requires an user!",
  })
  password: string;
}
