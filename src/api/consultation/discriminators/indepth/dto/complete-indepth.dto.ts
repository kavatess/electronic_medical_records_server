import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export class CompleteIndepthDto {
  @IsIn(["FREE", "COMPLETED"])
  @ApiProperty({ name: "reason", type: String, required: true })
  state: string;
}
