import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class PeriodDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "from", type: Date })
  readonly from?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "to", type: Date })
  readonly to?: Date;
}
