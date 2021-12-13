import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsMongoId,
} from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";

export class CreateTestResultDto extends IBaseDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "testRequest",
    type: String,
    properties: { refTo: { $ref: "test-request" } },
  })
  readonly testRequest?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "reportedAt", type: Date })
  readonly reportedAt?: Date;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "patient", type: String })
  readonly patient?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "interpretation", type: String })
  readonly interpretation?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "instructions", type: String })
  readonly instructions?: string;
}
