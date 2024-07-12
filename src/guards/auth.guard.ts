import { UserService } from "./../user/user.service";
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedException("Authorization must been provider!");
    }

    try {
      const token = authorization?.split(" ")[1];
      if (!token) throw new UnauthorizedException("Token must been provider!");

      const data = this.authService.checkToken(token);

      const user = await this.userService.show(data.sub);
      await this.userService.showByEmail(data.email);
      res.locals.user = user;

      return true;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(error.response);
      }
      throw new UnauthorizedException("Invalid token!");
    }
  }
}
