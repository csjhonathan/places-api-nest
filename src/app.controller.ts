import { Controller, Get, HttpStatus } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health_check")
  @ApiOperation({ summary: "Checks APIs health" })
  @ApiResponse({ status: HttpStatus.OK, description: "Everything is okay!" })
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
