import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "src/auth/user/user.service";
import { BaseServiceOptions } from "src/models/base-service-options.model";

@Injectable()
export class XAuthUserService {
  constructor(private readonly userService: UserService) {}

  async validateIfxAuthUserExisted(
    xAuthUser: string,
    options: BaseServiceOptions = {}
  ): Promise<string> {
    const userRole = await this.userService.getUserRole(xAuthUser);
    if (!userRole) {
      throw new NotFoundException(
        `${options.baseErrMsg}: Not found x-auth-user(${xAuthUser})`
      );
    }
    return userRole;
  }

  async validateIfxAuthUserIsAdmin(
    xAuthUser: string,
    options: BaseServiceOptions = {}
  ): Promise<string> {
    const userRole = await this.validateIfxAuthUserExisted(xAuthUser, options);
    if (userRole !== "admin") {
      throw new ForbiddenException(
        `${options.baseErrMsg}: x-auth-user(${xAuthUser}) is not authorized to do this action`
      );
    }
    return "admin";
  }
}
