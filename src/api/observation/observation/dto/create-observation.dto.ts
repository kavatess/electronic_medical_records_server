import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsIn,
} from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { TYPE_ENUM } from "../observation.module";
import { STATUS_ENUM } from "../observation.module";

export class CreateObservationDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @IsIn(TYPE_ENUM)
  @ApiProperty({ name: "type", type: String, enum: TYPE_ENUM })
  readonly type?: string;

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
  @ApiProperty({
    name: "test",
    type: String,
    properties: { refTo: { $ref: "test" } },
  })
  readonly test?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "testResult", type: String })
  readonly testResult?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "key", type: String })
  readonly key?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "value", type: String, required: true })
  readonly value?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "unit", type: String })
  readonly unit?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(STATUS_ENUM)
  @ApiProperty({ name: "status", type: String, enum: STATUS_ENUM })
  readonly status?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "isCalculated", type: Boolean })
  readonly isCalculated?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsOptional()
  // @IsDateString()
  @ApiProperty({ name: "observedAt", type: Date, required: true })
  readonly observedAt?: Date;
}
