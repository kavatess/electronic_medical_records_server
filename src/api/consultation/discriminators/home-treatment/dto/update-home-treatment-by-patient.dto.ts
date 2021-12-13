import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateHomeTreatmentByPatientDto {
  @IsOptional()
  @IsNotEmpty()
  readonly chiefComplaint?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly reason?: string;

  @IsOptional()
  @IsArray()
  readonly questions?: string[];
}
