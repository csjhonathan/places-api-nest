import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function dbSeed() {
  try {
    const places = await prisma.place.findMany();

    if (places.length >= 2) {
      throw "Places table have data!";
    }

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
