import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsMongoId,
  IsIn,
  ValidateNested,
  Min,
} from "class-validator";
import { IsNotEqualProperty } from "src/validators/is-not-equal-property.validator";
import { Type } from "class-transformer";
import { ShortLinkDto } from "./shortlink.dto";
import { TransferredDto } from "./transferred.dto";
import { CancelledByDto } from "./cancelled-by.dto";
import { IsDateString } from "class-validator";
import { BasicConsultationDto } from "src/api/consultation/dto/basic-consultation.dto";
import { HOME_TREATMENT_MEDIUM_ENUM } from "../home-treatment.constant";
import { FormDto } from "./form.dto";

export class CreateHomeTreatmentDto extends BasicConsultationDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "noneDrug", type: Boolean })
  readonly noneDrug?: boolean;

  @IsMongoId()
  @ApiProperty({ name: "provider", type: String, required: true })
  readonly provider: string;

  @IsMongoId()
  @IsNotEqualProperty("patient")
  @ApiProperty({ name: "providerUser", type: String, required: true })
  readonly providerUser: string;

  @IsMongoId()
  @ApiProperty({ name: "user", type: String, required: true })
  readonly user: string;

  @IsMongoId()
  @ApiProperty({ name: "patient", type: String, required: true })
  readonly patient: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(["home-treatment"])
  @ApiProperty({ name: "type", type: String })
  readonly type?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(HOME_TREATMENT_MEDIUM_ENUM)
  @ApiProperty({
    name: "medium",
    type: String,
    enum: HOME_TREATMENT_MEDIUM_ENUM,
  })
  readonly medium?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
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
  @IsNotEmpty()
  @ApiProperty({ name: "chiefComplaint", type: String })
  readonly chiefComplaint?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "symptom", type: String })
  readonly symptom?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "diagnosis", type: String, isArray: true })
  readonly diagnosis?: string[];

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
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "noteAudio", type: String, isArray: true })
  readonly noteAudio?: string[];

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "treatmentEndedAt", type: Date })
  readonly treatmentEndedAt?: Date;

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FormDto)
  @ApiProperty({ name: "forms", type: FormDto, isArray: true })
  readonly forms?: FormDto[];
}
