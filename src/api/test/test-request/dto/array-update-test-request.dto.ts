import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsOptional } from "class-validator";

export class ArrayUpdateTestRequestDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "tests", type: String })
  readonly tests?: string;
}
