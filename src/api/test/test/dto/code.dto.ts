import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CodeDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "loinc", type: String })
  readonly loinc?: string;
}
