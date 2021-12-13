import { SetMetadata } from "@nestjs/common";

import { AppAbility } from "./app-ability";

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = "check_policy";
export const CheckPolicies = (...handlers: PolicyHandler[]): any =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
