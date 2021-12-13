import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RejectHomeTreatmentDto {
  @IsString()
  @ApiProperty({ name: "comment", type: String, required: true })
  readonly comment: string;

  @IsNotEmpty()
  @ApiProperty({ name: "reason", type: String, required: true })
  readonly reason: string;
}
