import { PrismaClient } from "@prisma/client";
import { EncryptionHelper } from "../src/helpers/libs/encryption";

const prisma = new PrismaClient();

async function dbSeed() {
  try {
    const places = await prisma.place.findMany();
    const users = await prisma.user.findMany();

    if (places.length >= 2) {
      console.log("Places table have data!");
    } else {
      const places_names = [
        "Museu do Amanhã",
        "Quinta da Boa Vista",
        "Praça XV",
        "Praia de Copacabana",
      ];

      places_names.forEach(async (name) => {
        await prisma.place.create({
          data: {
            city: "Rio de Janeiro",
            state: "Rio de Janeiro",
            name,
          },
        });
        console.log(`Place:${name} added in database!`);
      });
    }

    if (users.length >= 1) {
      console.log("Users table have data!");
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
