import { IsIn } from "class-validator";

export class CancelFollowUpQuestionDto {
  @IsIn(["cancelled", "rejected"])
  state: string;
}
