import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { SignInDto } from "./dto/sign-in.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.getUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException("User already exists!");
    }

    return this.usersService.create(createUserDto);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.getUserByEmail(signInDto.email);

    if (!user) {
      throw new NotFoundException("User must be exists!");
    }

    const passwordIsValid = bcrypt.compareSync(
      signInDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException("Invalid credentials!");
    }

    return this.generateToken(user);
  }

  checkToken(token: string): {
    email: string;
    name: string;
    sub: number;
  } {
    const tokenData = this.jwtService.verify(token);
    return { ...tokenData, sub: parseInt(tokenData.sub) };
  }

  private getUserByEmail(email: string) {
    return this.usersService.showByEmail(email);
  }

  private generateToken(user: User) {
    const { id, email, name } = user;

    return {
      token: this.jwtService.sign(
        {
          id,
          email,
          name,
        },
        { subject: String(id) },
      ),
    };
  }
}
