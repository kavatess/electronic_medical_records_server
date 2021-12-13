import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsIn,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { NameDto } from "./name.dto";
import { TYPE_ENUM } from "../medical-reference.module";

export class CreateMedicalReferenceDto extends IBaseDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ name: "name", type: NameDto })
  readonly name?: NameDto;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(TYPE_ENUM)
  @ApiProperty({ name: "type", type: String, enum: TYPE_ENUM })
  readonly type?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "value", type: Number })
  readonly value?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "order", type: Number })
  readonly order?: number;
}
