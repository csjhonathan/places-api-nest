import { faker } from "@faker-js/faker";

export class MockUserFactorie {
  static partialBody(field?: "email" | "name" | "password") {
    switch (field) {
      case "email":
        return {
          name: faker.person.firstName(),
          password: faker.internet.password(),
        } satisfies { name: string; password: string };
      case "name":
        return {
          email: faker.internet.email(),
          password: faker.internet.password(),
        } satisfies { email: string; password: string };
      case "password":
        return {
          name: faker.person.firstName(),
          email: faker.internet.email(),
        } satisfies { name: string; email: string };
      default:
        return {};
    }
  }

  static completeBody() {
    return {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    } satisfies { name: string; email: string; password: string };
  }
}
