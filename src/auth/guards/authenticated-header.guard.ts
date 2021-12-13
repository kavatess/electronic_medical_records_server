import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  CACHE_MANAGER,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/auth/user/user.service";
import { Cache } from "cache-manager";
import { UserRoleService } from "src/auth/user-role/user-role.service";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthenticatedHeaderGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.configService.get("auth.disabled", false)) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.header("token");
    if (!token) return false;
    try {
      const verified = this.jwtService.verify(token, {
        secret: this.configService.get("auth.secret"),
      });
      if (!verified.idt) throw Error("malformed jwt - missing user");

      let user = await this.cacheManager.get("token:" + token);
      if (!user)
        user = await this.userService.findOne({ _id: verified.idt }, "_id");
      if (!user) user = await this.userService.create({ _id: verified.idt });
      if (!user["roles"])
        user["roles"] = (
          await this.userRoleService.find({ user: user["_id"] }, "role")
        ).map((i) => i.role);
      this.cacheManager.set("token:" + token, user, { ttl: 60 * 60 }); // cache for bext 1 hour

      request.headers["x-auth-user"] = user["_id"];
      request.headers["X-Auth-Roles"] = user["roles"];
      return true;
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }
}
