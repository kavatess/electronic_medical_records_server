import { IsNotEmpty, IsString } from "class-validator";

export class AnswerFollowUpQuestionDto {
  @IsString()
  @IsNotEmpty()
  answer: string;
}
