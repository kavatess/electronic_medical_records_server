import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsIn } from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";

import { TYPE_ENUM } from "../patient-note.module";

export class CreatePatientNoteDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "patient", type: String, required: true })
  readonly patient?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "note", type: String, required: true })
  readonly note?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(TYPE_ENUM)
  @ApiProperty({ name: "type", type: String, enum: TYPE_ENUM })
  readonly type?: string;
}
