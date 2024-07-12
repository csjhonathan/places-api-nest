import { Injectable } from "@nestjs/common";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  show(id: number) {
    return this.userRepository.show(id);
  }

  showByEmail(email: string) {
    return this.userRepository.showByEmail(email);
  }
}
