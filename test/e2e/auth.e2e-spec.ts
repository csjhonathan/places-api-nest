import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import TestAgent from "supertest/lib/agent";
import { TestHelpers } from "@/test/helpers/test.helpers";
import { MockUserFactorie } from "@/test/factories/user/mock";
import { DbUserFactorie } from "@/test/factories/user/db";

describe("AuthController (e2e)", () => {
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

  describe("/sign_up", () => {
    it("should return an bad request response when user body is invalid", async () => {
      const { statusCode } = await server
        .post("/auth/sign_up")
        .send(MockUserFactorie.partialBody());

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("should return an conflict response when user already exists", async () => {
      const { email } = await DbUserFactorie.create(prisma);

      const { statusCode } = await server
        .post("/auth/sign_up")
        .send(MockUserFactorie.completeBody({ email }));

      expect(statusCode).toBe(HttpStatus.CONFLICT);
    });

    it("should return an created response when user is successfully created", async () => {
      const data = MockUserFactorie.completeBody();

      const { statusCode, body } = await server
        .post("/auth/sign_up")
        .send(data);

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        id: expect.any(Number),
        email: body.email,
        name: body.name,
      });
    });
  });

  describe("/sign_in", () => {
    it("should return an not found error when users not exists", async () => {
      const data = MockUserFactorie.completeBody();
      const { statusCode } = await server.post("/auth/sign_in").send(data);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return un unauthorized error when users exists but incorret credentials is provided", async () => {
      const data = MockUserFactorie.completeBody();

      const { email } = await DbUserFactorie.createEncrypted({
        prisma,
        user: data,
      });

      const { statusCode } = await server.post("/auth/sign_in").send(
        MockUserFactorie.completeBody({
          email,
        }),
      );

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should return an success response when user exists and correct credentials is provided", async () => {
      const data = MockUserFactorie.completeBody();

      const { email } = await DbUserFactorie.createEncrypted({
        prisma,
        user: data,
      });

      const { statusCode, body } = await server.post("/auth/sign_in").send(
        MockUserFactorie.completeBody({
          email,
          password: data.password,
        }),
      );

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual<{ token: string }>({
        token: expect.any(String),
      });
    });
  });
});
