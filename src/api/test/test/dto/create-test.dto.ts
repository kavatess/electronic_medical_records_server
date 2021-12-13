import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsIn, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { CodeDto } from "./code.dto";
import { TYPE_ENUM } from "../test.module";
import { SPECIMEN_ENUM } from "../test.module";
import { LOCALE_ENUM } from "../test.module";

export class CreateTestDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String, required: true })
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(TYPE_ENUM)
  @ApiProperty({ name: "type", type: String, required: true, enum: TYPE_ENUM })
  readonly type?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(SPECIMEN_ENUM)
  @ApiProperty({ name: "specimen", type: String, enum: SPECIMEN_ENUM })
  readonly specimen?: string;

  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "tags", type: String, isArray: true })
  readonly tags?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CodeDto)
  @ApiProperty({ name: "code", type: CodeDto })
  readonly code?: CodeDto;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "abbreviation", type: String })
  readonly abbreviation?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(LOCALE_ENUM)
  @ApiProperty({ name: "locale", type: String, enum: LOCALE_ENUM })
  readonly locale?: string;
}
