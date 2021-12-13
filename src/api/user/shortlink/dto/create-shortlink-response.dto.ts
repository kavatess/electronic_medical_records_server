import { Matches } from "class-validator";

export class CreateShortlinkResponseDto {
  @Matches(new RegExp("^https:"))
  shortLink: string;
}
