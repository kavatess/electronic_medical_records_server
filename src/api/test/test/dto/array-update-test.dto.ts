import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ArrayUpdateTestDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "tags", type: String })
  readonly tags?: string;
}
