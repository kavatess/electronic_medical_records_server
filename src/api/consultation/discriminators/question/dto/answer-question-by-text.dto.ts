import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AnswerQuestionByTextDto {
  @IsNotEmpty()
  @ApiProperty({ name: "note", type: String, required: true })
  readonly note: string;
}
