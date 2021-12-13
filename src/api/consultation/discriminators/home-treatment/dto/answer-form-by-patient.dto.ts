import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { FormDto } from "./form.dto";

export class AnswerFormByPatientDto extends FormDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "_id", type: String })
  readonly _id?: string;
}
