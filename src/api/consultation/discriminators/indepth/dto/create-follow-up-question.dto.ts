import { IsOptional, IsNotEmpty, IsString, IsIn } from "class-validator";
import { INDEPTH_FOLLOW_UP_QUESTION_TYPE_ENUM } from "../indepth.constant";

export class CreateFollowUpQuestionDto {
  @IsString()
  @IsNotEmpty()
  readonly question: string;

  @IsOptional()
  @IsIn(INDEPTH_FOLLOW_UP_QUESTION_TYPE_ENUM)
  readonly type?: string;
}
