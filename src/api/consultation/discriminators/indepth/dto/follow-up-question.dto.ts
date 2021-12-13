import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import {
  INDEPTH_FOLLOW_UP_QUESTION_STATE_ENUM,
  INDEPTH_FOLLOW_UP_QUESTION_TYPE_ENUM,
} from "../indepth.constant";

export class FollowUpQuestionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsIn(INDEPTH_FOLLOW_UP_QUESTION_TYPE_ENUM)
  @ApiProperty({
    name: "type",
    type: String,
    enum: INDEPTH_FOLLOW_UP_QUESTION_TYPE_ENUM,
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
  @IsIn(INDEPTH_FOLLOW_UP_QUESTION_STATE_ENUM)
  @ApiProperty({
    name: "state",
    type: String,
    enum: INDEPTH_FOLLOW_UP_QUESTION_STATE_ENUM,
  })
  readonly state?: string;
}
