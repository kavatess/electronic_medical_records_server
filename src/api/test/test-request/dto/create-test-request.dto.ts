import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsMongoId, IsIn } from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { STATE_ENUM } from "../test-request.module";
import { URGENCY_ENUM } from "../test-request.module";

export class CreateTestRequestDto extends IBaseDto {
  @IsMongoId()
  @ApiProperty({
    name: "provider",
    type: String,
    properties: { refTo: { $ref: "provider" } },
  })
  readonly provider?: string;

  @IsMongoId()
  @ApiProperty({
    name: "consultation",
    type: String,
    properties: { refTo: { $ref: "consultation" } },
  })
  readonly consultation?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "tests",
    type: String,
    isArray: true,
    properties: { refTo: { $ref: "test" } },
  })
  readonly tests?: string[];

  @IsMongoId()
  @ApiProperty({
    name: "patient",
    type: String,
    properties: { refTo: { $ref: "user" } },
  })
  readonly patient?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(STATE_ENUM)
  @ApiProperty({ name: "state", type: String, enum: STATE_ENUM })
  readonly state?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(URGENCY_ENUM)
  @ApiProperty({ name: "urgency", type: String, enum: URGENCY_ENUM })
  readonly urgency?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "instructions", type: String })
  readonly instructions?: string;
}
