import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsIn, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { CodeDto } from "./code.dto";
import { LOCALE_ENUM } from "../diagnosis.module";

export class CreateDiagnosisDto extends IBaseDto {
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String, required: true })
  readonly name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CodeDto)
  @ApiProperty({ name: "code", type: CodeDto })
  readonly code?: CodeDto;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(LOCALE_ENUM)
  @ApiProperty({ name: "locale", type: String, enum: LOCALE_ENUM })
  readonly locale?: string;
}
