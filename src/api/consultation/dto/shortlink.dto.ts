import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ShortLinkDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "provider", type: String })
  readonly provider?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "patient", type: String })
  readonly patient?: string;
}
