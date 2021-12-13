import { IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RatingInfoDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "average", type: Number })
  readonly average?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "voter", type: Number })
  readonly voter?: number;
}
