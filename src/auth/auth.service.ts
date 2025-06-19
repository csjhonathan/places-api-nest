import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { SignInDto } from "./dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { CreateUserDto } from "@/user/dto/create-user.dto";
import { EncryptionHelper } from "@/helpers/libs/encryption";

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

    const passwordIsValid = EncryptionHelper.compareData({
      raw_data: signInDto.password,
      encrypted_data: user.password,
    });

    if (!passwordIsValid) {
      throw new UnauthorizedException("Invalid credentials!");
    }

    return this.generateToken(user);
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
