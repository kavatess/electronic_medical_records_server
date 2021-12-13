import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateHomeTreatmentByProviderDto {
  @IsOptional()
  @IsNotEmpty()
  readonly note?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly symptom?: string;
}
