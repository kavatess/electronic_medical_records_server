import { IsOptional, IsString } from "class-validator";

export class Header {
  @IsOptional()
  @IsString()
  readonly "x-correlation-id"?: string;

  @IsOptional()
  @IsString()
  readonly "x-auth-user"?: string;
}
