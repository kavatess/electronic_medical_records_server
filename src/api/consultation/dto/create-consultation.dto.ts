import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsIn,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { BasicConsultationDto } from "./basic-consultation.dto";
import { MEDIUM_ENUM } from "../consultation.constant";
import { IsNotEqualProperty } from "src/validators/is-not-equal-property.validator";
import { ShortLinkDto } from "./shortlink.dto";
import { FollowUpQuestionDto } from "./follow-up-question.dto";
import { TransferredDto } from "./transferred.dto";
import { CancelledByDto } from "./cancelled-by.dto";

export class CreateConsultationDto extends BasicConsultationDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "noneDrug", type: Boolean })
  readonly noneDrug?: boolean;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "provider",
    type: String,
    required: true,
    properties: { refTo: { $ref: "provider" } },
  })
  readonly provider?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotEqualProperty("patient")
  @ApiProperty({
    name: "providerUser",
    type: String,
    required: true,
    properties: { refTo: { $ref: "user" } },
  })
  readonly providerUser?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "user",
    type: String,
    required: true,
    properties: { refTo: { $ref: "user" } },
  })
  readonly user?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "patient", type: String, required: true })
  readonly patient?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(MEDIUM_ENUM)
  @ApiProperty({ name: "medium", type: String, enum: MEDIUM_ENUM })
  readonly medium?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "consultTime", type: Number })
  readonly consultTime?: number;

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
  @IsDateString()
  @ApiProperty({ name: "treatmentEndedAt", type: Date })
  readonly treatmentEndedAt?: Date;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "chiefComplaint", type: String })
  readonly chiefComplaint?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "symptom", type: String })
  readonly symptom?: string;

  @IsOptional()
  @IsMongoId({ each: true })
  @ApiProperty({ name: "diagnosis", type: String, isArray: true })
  readonly diagnosis?: string[];

  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "altDiagnoses", type: String, isArray: true })
  readonly altDiagnoses?: string[];

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "note", type: String })
  readonly note?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "conversation", type: String })
  readonly conversation?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FollowUpQuestionDto)
  @ApiProperty({ name: "followUpQuestion", type: FollowUpQuestionDto })
  readonly followUpQuestion?: FollowUpQuestionDto;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "reason", type: String })
  readonly reason?: string;

  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "questions", type: String, isArray: true })
  readonly questions?: string[];

  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "noteAudio", type: String, isArray: true })
  readonly noteAudio?: string[];

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
