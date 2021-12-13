import { Ability } from "@casl/ability";
import { Subjects } from "./subjects";

export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

export type AppAbility = Ability<[Action, Subjects]>;
