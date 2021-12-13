import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { FormAnswerDto } from "./form-answer.dto";

export class FormDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "id", type: String })
  readonly id?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "slug", type: String })
  readonly slug?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "imageUrl", type: String })
  readonly imageUrl?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "description", type: String })
  readonly description?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "submittedAt", type: Date })
  readonly submittedAt?: Date;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FormAnswerDto)
  readonly answers?: FormAnswerDto[];

  @IsOptional()
  @IsNotEmptyObject()
  @ApiProperty({ name: "totalScore", type: Object })
  readonly hiddenFields?: any;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "totalScore", type: Number })
  readonly totalScore?: number;
}
