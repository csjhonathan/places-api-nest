import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

export class AuthenticationFactorie {
  static generateInvalidToken() {
    return `Bearer ${faker.lorem.word()}`;
  }

  static generateToken(user: User) {
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });

    const { id, email, name } = user;

    const token = jwtService.sign(
      {
        email,
        name,
      },
      { subject: String(id) },
    );

    return `Bearer ${token}`;
  }
}
