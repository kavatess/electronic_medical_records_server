import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { CreatePrescriptionAutoFillDto } from "./create-prescription-auto-fill.dto";

export class PrescriptionAutoFillDto extends CreatePrescriptionAutoFillDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly createdAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly updatedAt?: string;
}
