import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  show(id: number): Promise<User | null> {
    return this.userRepository.show(id);
  }

  showByEmail(email: string) {
    return this.userRepository.showByEmail(email);
  }
}
