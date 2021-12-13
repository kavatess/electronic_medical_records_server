import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateIndepthByProviderDto {
  @IsOptional()
  @IsNotEmpty()
  readonly note?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly symptom?: string;
}
