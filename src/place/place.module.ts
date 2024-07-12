import { Module } from "@nestjs/common";
import { PlaceService } from "./place.service";
import { PlaceController } from "./place.controller";
import { PlaceRepository } from "./place.repository";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository],
  imports: [AuthModule, UserModule],
})
export class PlaceModule {}
