import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class FormAnswerDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "isHidden", type: Boolean })
  readonly isHidden?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ name: "provider", type: String })
  readonly questionTitle?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ name: "provider", type: String })
  readonly text?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "hasScore", type: Boolean })
  readonly hasScore?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "score", type: Number })
  readonly score?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "isCalculator", type: Boolean })
  readonly isCalculator?: boolean;
}
