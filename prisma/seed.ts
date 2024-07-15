import { PrismaClient } from "@prisma/client";
import { EncryptionHelper } from "../src/helpers/libs/encryption";

const prisma = new PrismaClient();

async function dbSeed() {
  try {
    const places = await prisma.place.findMany();
    const users = await prisma.user.findMany();

    if (places.length) {
      console.log("Places already seeded");
    } else {
      const places_names = [
        "Museu do Amanhã",
        "Quinta da Boa Vista",
        "Praça XV",
        "Praia de Copacabana",
      ];

      console.log("Creating places...");
      await Promise.all(
        places_names.map(async (name) => {
          await prisma.place.create({
            data: {
              city: "Rio de Janeiro",
              state: "Rio de Janeiro",
              name,
            },
          });
          console.log(`Place:${name} added in database!`);
        }),
      );
    }

    if (users.length) {
      console.log("Users already seeded");
    } else {
      console.log("Creating test user...");
      await prisma.user.create({
        data: {
          name: "Test",
          email: "test@email.com",
          password: EncryptionHelper.hashData("123456"),
        },
      });
    }

    console.log("Seed completed");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

dbSeed().catch((e) => {
  console.log(e.message);
});
