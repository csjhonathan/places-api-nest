import { faker } from "@faker-js/faker";
import { Place } from "@prisma/client";

export class MockPlaceFactorie {
  static completeBody(
    params?: Partial<Pick<Place, "name" | "city" | "state">>,
  ) {
    const { name, city, state } = params || {};
    return {
      name: name || faker.company.name(),
      city: city || faker.location.city.name,
      state: state || faker.location.state.name,
    } satisfies Pick<Place, "name" | "city" | "state">;
  }
}
