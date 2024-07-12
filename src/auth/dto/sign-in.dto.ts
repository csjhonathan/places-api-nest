import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    example: "some@email.com",
    description: "This field requires a email to authenticate!",
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "123123",
    description: "This field requires a password to authenticate!",
  })
  password: string;
}
