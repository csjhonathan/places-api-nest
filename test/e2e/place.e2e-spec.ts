import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import TestAgent from "supertest/lib/agent";
import { TestHelpers } from "../helpers/test.helpers";

describe("PlaceController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let server: TestAgent;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Authentication", () => {
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
          .set("Authorization", `Bearer 1111`);

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
          .set("Authorization", `Bearer 1111`);

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Invalid token!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
    });

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
          .set("Authorization", `Bearer 1111`);

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
          .set("Authorization", `Bearer 1111`);

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
          .set("Authorization", `Bearer 1111`);

        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(body).toEqual({
          error: "Unauthorized",
          message: "Invalid token!",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
    });
  });
});
