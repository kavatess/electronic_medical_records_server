import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CodeDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "icd10", type: String })
  readonly icd10?: string;
}
