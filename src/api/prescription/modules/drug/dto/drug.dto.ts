import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { CreateDrugDto } from "./create-drug.dto";

export class DrugDto extends CreateDrugDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly createdAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly updatedAt?: string;
}
