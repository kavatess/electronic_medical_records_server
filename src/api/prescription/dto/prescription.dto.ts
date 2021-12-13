import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { CreatePrescriptionDto } from "./create-prescription.dto";

export class PrescriptionDto extends CreatePrescriptionDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly createdAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly updatedAt?: string;
}
