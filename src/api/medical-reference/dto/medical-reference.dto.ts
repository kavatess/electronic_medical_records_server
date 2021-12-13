import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { CreateMedicalReferenceDto } from "./create-medical-reference.dto";

export class MedicalReferenceDto extends CreateMedicalReferenceDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly createdAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly updatedAt?: string;
}
