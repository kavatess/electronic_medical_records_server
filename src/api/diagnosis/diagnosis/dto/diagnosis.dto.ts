import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { CreateDiagnosisDto } from "./create-diagnosis.dto";

export class DiagnosisDto extends CreateDiagnosisDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly createdAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly updatedAt?: string;
}
