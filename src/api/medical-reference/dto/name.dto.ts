import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class NameDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "en", type: String })
  readonly en?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "vi", type: String })
  readonly vi?: string;
}
