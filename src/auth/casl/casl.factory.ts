import { Injectable } from "@nestjs/common";
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Action, AppAbility } from "./app-ability";
import { Subjects } from "./subjects";
import { UserRole } from "src/auth/user-role/schemas/user-role.schema";

class AuthenticatedUser {
  _id: string;
  roles: string[];
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: AuthenticatedUser): any {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    );

    for (const role of user.roles) {
      switch (role) {
        case "superadmin":
          can(Action.Manage, "all");
          break;

        case "admin":
          can(Action.Create, UserRole);
          can(Action.Read, "all");

        default:
      }
    }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build();
  }
}
