import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsMongoId,
} from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";

export class CreatePrescriptionDto extends IBaseDto {
  @IsMongoId()
  @ApiProperty({
    name: "consultation",
    type: String,
    properties: { refTo: { $ref: "consultation" } },
  })
  readonly consultation?: string;

  @IsMongoId()
  @ApiProperty({
    name: "drug",
    type: String,
    required: true,
    properties: { refTo: { $ref: "drug" } },
  })
  readonly drug?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "route", type: String })
  readonly route?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "take", type: Number })
  readonly take?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "unit", type: String })
  readonly unit?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "total", type: Number })
  readonly total?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "duration", type: Number })
  readonly duration?: number;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "frequency", type: String })
  readonly frequency?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "note", type: String })
  readonly note?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "followDirection", type: Boolean })
  readonly followDirection?: boolean;
}
