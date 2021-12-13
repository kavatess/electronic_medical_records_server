import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsIn,
  ValidateNested,
} from "class-validator";
import { IsNotEqualProperty } from "src/validators/is-not-equal-property.validator";
import { Type } from "class-transformer";
import { ShortLinkDto } from "./shortlink.dto";
import { TransferredDto } from "./transferred.dto";
import { CancelledByDto } from "./cancelled-by.dto";
import { BasicConsultationDto } from "src/api/consultation/dto/basic-consultation.dto";
import {
  CREATE_QUESTION_STATE_ENUM,
  QUESTION_MEDIUM_ENUM,
} from "../question.constant";

export class CreateQuestionDto extends BasicConsultationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsIn(CREATE_QUESTION_STATE_ENUM)
  @ApiProperty({ name: "state", type: String })
  readonly state?: string;

  @IsMongoId()
  @ApiProperty({ name: "provider", type: String, required: true })
  readonly provider?: string;

  @IsMongoId()
  @IsNotEqualProperty("patient")
  @ApiProperty({ name: "providerUser", type: String, required: true })
  readonly providerUser?: string;

  @IsMongoId()
  @ApiProperty({ name: "user", type: String, required: true })
  readonly user?: string;

  @IsMongoId()
  @ApiProperty({ name: "patient", type: String, required: true })
  readonly patient?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(["question"])
  @ApiProperty({ name: "type", type: String })
  readonly type?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(QUESTION_MEDIUM_ENUM)
  @ApiProperty({ name: "medium", type: String, enum: QUESTION_MEDIUM_ENUM })
  readonly medium?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShortLinkDto)
  @ApiProperty({ name: "shortLink", type: ShortLinkDto })
  readonly shortLink?: ShortLinkDto;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "orderItem", type: String })
  readonly orderItem?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "order", type: String })
  readonly order?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "chiefComplaint", type: String })
  readonly chiefComplaint?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "note", type: String })
  readonly note?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "conversation", type: String })
  readonly conversation?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "reason", type: String })
  readonly reason?: string;

  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "questions", type: String, isArray: true })
  readonly questions?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TransferredDto)
  @ApiProperty({ name: "transferred", type: TransferredDto })
  readonly transferred?: TransferredDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CancelledByDto)
  @ApiProperty({ name: "cancelledBy", type: CancelledByDto })
  readonly cancelledBy?: CancelledByDto;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "comment", type: String })
  readonly comment?: string;
}
