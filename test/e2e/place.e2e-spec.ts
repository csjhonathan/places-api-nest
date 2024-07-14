import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import TestAgent from "supertest/lib/agent";
import { TestHelpers } from "../helpers/test.helpers";
import { faker } from "@faker-js/faker";
import { AuthenticationFactorie } from "../factories/auth";
import { DbUserFactorie } from "../factories/user/db";
import { MockUserFactorie } from "../factories/user/mock";
import { MockPlaceFactorie } from "../factories/place/mock";
import { Place } from "@prisma/client";
import { DbPlaceFactorie } from "../factories/place/db";

describe("PlaceController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let server: TestAgent;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    server = request(app.getHttpServer());

    await TestHelpers.cleanDb(prisma);

    const user = await DbUserFactorie.createEncrypted({
      prisma,
      user: MockUserFactorie.completeBody(),
    });

    token = AuthenticationFactorie.generateToken(user);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("when token is invalid", () => {
    describe("/places (create)", () => {
      it("should return an unauthorized response when token is not provided", async () => {
        const { statusCode, body } = await server.post("/places");

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Authorization must been provider!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });

      it("should return an unauthorized response when invalid token is provided", async () => {
        const { statusCode, body } = await server
          .post("/places")
          .set("Authorization", `Bearer ${faker.lorem.word()}`);

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Invalid token!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
    });

    describe("/places (destroy)", () => {
      it("should return an unauthorized response when token is not provided", async () => {
        const { statusCode, body } = await server.delete("/places/1");

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Authorization must been provider!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });

      it("should return an unauthorized response when invalid token is provided", async () => {
        const { statusCode, body } = await server
          .delete("/places/1")
          .set("Authorization", `Bearer ${faker.lorem.word()}`);

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Invalid token!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
    });

    describe("/places (index)", () => {
      it("should return an unauthorized response when token is not provided", async () => {
        const { statusCode, body } = await server.get("/places");

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Authorization must been provider!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });

      it("should return an unauthorized response when invalid token is provided", async () => {
        const { statusCode, body } = await server
          .get("/places")
          .set("Authorization", `Bearer ${faker.lorem.word()}`);

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Invalid token!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
    });

    describe("/places (show)", () => {
      it("should return an unauthorized response when token is not provided", async () => {
        const { statusCode, body } = await server.get("/places/1");

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Authorization must been provider!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });

      it("should return an unauthorized response when invalid token is provided", async () => {
        const { statusCode, body } = await server
          .get("/places/1")
          .set("Authorization", `Bearer ${faker.lorem.word()}`);

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Invalid token!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
    });

    describe("/places (update)", () => {
      it("should return an unauthorized response when token is not provided", async () => {
        const { statusCode, body } = await server.patch("/places/1");

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Authorization must been provider!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });

      it("should return an unauthorized response when invalid token is provided", async () => {
        const { statusCode, body } = await server
          .patch("/places/1")
          .set("Authorization", `Bearer ${faker.lorem.word()}`);

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Invalid token!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
    });
  });

  describe("when token is valid", () => {
    describe("/places (create)", () => {
      it("should return an bad request error when body is invalid", async () => {
        const { statusCode } = await server
          .post("/places")
          .send({})
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it("should return an created response when body is valid", async () => {
        const data = MockPlaceFactorie.completeBody();
        const { statusCode, body } = await server
          .post("/places")
          .send(data)
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual<{ place: Place }>({
          place: {
            id: expect.any(Number),
            name: data.name,
            city: data.city,
            state: data.state,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            discarded_at: null,
          },
        });
      });
    });

    describe("/places (destroy)", () => {
      it("should return an not found response when place not exists", async () => {
        const { statusCode } = await server
          .delete("/places/1")
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it("should return an unprocessable entity response when invalid id is provided", async () => {
        const { statusCode } = await server
          .delete(`/places/${faker.lorem.word()}`)
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      });

      it("should return an success response when place is deleted successfully", async () => {
        const data = await DbPlaceFactorie.create({ prisma });
        const { statusCode, body } = await server
          .delete(`/places/${data.id}`)
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(body).toEqual<{ place: Place }>({
          place: {
            id: expect.any(Number),
            name: data.name,
            city: data.city,
            state: data.state,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            discarded_at: expect.any(String),
          },
        });
      });
    });

    describe("/places (index)", () => {
      it("should return an 'places' empty array when have no places to find", async () => {
        const { statusCode, body } = await server
          .get("/places")
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(body).toEqual({
          places: [],
        });
        expect(body.places).toHaveLength(0);
      });

      it("should return an 'places' array with five places", async () => {
        await DbPlaceFactorie.create({
          prisma,
          many: 5,
        });

        const { statusCode, body } = await server
          .get("/places")
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(body).toEqual({
          places: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              city: expect.any(String),
              state: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              discarded_at: null,
            }),
          ]),
        });
        expect(body.places).toHaveLength(5);
      });
    });

    describe("/places (show)", () => {
      it("should return an not found error when place not exists", async () => {
        const { statusCode, body } = await server
          .get("/places/1")
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(body).toEqual({
          error: "Not Found",
          message: "This place doesn't exists or has been deleted!",
          statusCode: HttpStatus.NOT_FOUND,
        });
      });

      it("should return an unprocessable entity response when invalid id is provided", async () => {
        const { statusCode } = await server
          .get(`/places/${faker.lorem.word()}`)
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      });

      it("should return unique place when valid id is provided and place exists", async () => {
        const places = await DbPlaceFactorie.create({
          prisma,
          many: 5,
        });

        const { statusCode, body } = await server
          .get(`/places/${places[0].id}`)
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(body).toEqual({
          place: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            city: expect.any(String),
            state: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            discarded_at: null,
          }),
        });
      });
    });

    describe("/places (update)", () => {
      it("should return an not found error when place not exists", async () => {
        const { statusCode, body } = await server
          .patch("/places/1")
          .send({})
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(body).toEqual({
          error: "Not Found",
          message: "This place doesn't exists or has been deleted!",
          statusCode: HttpStatus.NOT_FOUND,
        });
      });

      it("should return an unprocessable entity response when invalid id is provided", async () => {
        const { statusCode } = await server
          .get(`/places/${faker.lorem.word()}`)
          .send({})
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      });

      it("should return an success response when body is valid and place exists", async () => {
        const dbData = await DbPlaceFactorie.create({ prisma });
        const data = MockPlaceFactorie.completeBody();
        const { statusCode, body } = await server
          .patch(`/places/${dbData.id}`)
          .send(data)
          .set("Authorization", token);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(body).toEqual<{ place: Place }>({
          place: {
            id: expect.any(Number),
            name: data.name,
            city: data.city,
            state: data.state,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            discarded_at: null,
          },
        });
      });
    });
  });
});
