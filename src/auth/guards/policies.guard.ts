import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { AppAbility } from "src/auth/casl/app-ability";
import { CaslAbilityFactory } from "src/auth/casl/casl.factory";
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from "src/auth/casl/check-policy.decorator";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.configService.get("auth.disabled", false)) return true;
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      ) || [];

    const request = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser({
      _id: request.headers["x-auth-user"],
      roles: request.headers["X-Auth-Roles"],
    });

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability)
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === "function") {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
