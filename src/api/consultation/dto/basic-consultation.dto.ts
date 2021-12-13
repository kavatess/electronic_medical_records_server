import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsIn,
  ValidateNested,
} from "class-validator";
import { STATE_ENUM, TYPE_ENUM } from "../consultation.constant";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { Type } from "class-transformer";
import { MetadataDto } from "./metadata.dto";

export class BasicConsultationDto extends IBaseDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "test", type: Boolean })
  readonly test?: boolean;

  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "tags", type: String, isArray: true })
  readonly tags?: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsIn(TYPE_ENUM)
  @ApiProperty({ name: "type", type: String, enum: TYPE_ENUM })
  readonly type?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(STATE_ENUM)
  @ApiProperty({ name: "state", type: String, enum: STATE_ENUM })
  readonly state?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "closedAt", type: Date })
  readonly closedAt?: Date;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "metaString", type: String })
  readonly metaString?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  @ApiProperty({ name: "metadata", type: MetadataDto })
  readonly metadata?: MetadataDto;
}
