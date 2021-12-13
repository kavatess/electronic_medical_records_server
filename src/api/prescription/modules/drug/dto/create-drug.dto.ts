import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsIn } from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { STATE_ENUM } from "../drug.constant";

export class CreateDrugDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(STATE_ENUM)
  @ApiProperty({ name: "state", type: String, enum: STATE_ENUM })
  readonly state?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "route", type: String })
  readonly route?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "strength", type: String })
  readonly strength?: string;
}
