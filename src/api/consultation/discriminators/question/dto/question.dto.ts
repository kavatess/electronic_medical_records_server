import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsMongoId, IsIn } from "class-validator";
import { STATE_ENUM } from "src/api/consultation/consultation.constant";
import { IsNotEqualProperty } from "src/validators/is-not-equal-property.validator";
import { CreateQuestionDto } from "./create-question.dto";

export class QuestionDto extends CreateQuestionDto {
  @IsOptional()
  @IsIn(STATE_ENUM)
  @ApiProperty({ name: "state", type: String })
  readonly state?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "provider", type: String, required: true })
  readonly provider?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotEqualProperty("patient")
  @ApiProperty({ name: "providerUser", type: String, required: true })
  readonly providerUser?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "user", type: String, required: true })
  readonly user?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "patient", type: String, required: true })
  readonly patient?: string;
}
