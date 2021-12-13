import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class MetadataDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "minuteAvg", type: Number })
  readonly minuteAvg?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "yearsofEXP", type: Number })
  readonly yearsofEXP?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "privateDoctorReply", type: String })
  readonly privateDoctorReply?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "ratingGood", type: Number })
  readonly ratingGood?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "registerQuickcall", type: Boolean })
  readonly registerQuickcall?: boolean;
}
