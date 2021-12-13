import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { HOME_TREATMENT_COMPLETE_STATE_ENUM } from "../home-treatment.constant";

export class CompleteHomeTreatmentDto {
  @IsIn(HOME_TREATMENT_COMPLETE_STATE_ENUM)
  @ApiProperty({ name: "reason", type: String, required: true })
  state: string;
}
