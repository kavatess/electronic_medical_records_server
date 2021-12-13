import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import {
  FOLLOW_UP_QUESTION_STATE_ENUM,
  FOLLOW_UP_QUESTION_TYPE_ENUM,
} from "../consultation.constant";

export class FollowUpQuestionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsIn(FOLLOW_UP_QUESTION_TYPE_ENUM)
  @ApiProperty({
    name: "type",
    type: String,
    enum: FOLLOW_UP_QUESTION_TYPE_ENUM,
  })
  readonly type?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "question", type: String })
  readonly question?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "answer", type: String })
  readonly answer?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(FOLLOW_UP_QUESTION_STATE_ENUM)
  @ApiProperty({
    name: "state",
    type: String,
    enum: FOLLOW_UP_QUESTION_STATE_ENUM,
  })
  readonly state?: string;
}
