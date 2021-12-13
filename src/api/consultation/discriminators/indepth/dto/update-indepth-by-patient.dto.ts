import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateIndepthByPatientDto {
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
