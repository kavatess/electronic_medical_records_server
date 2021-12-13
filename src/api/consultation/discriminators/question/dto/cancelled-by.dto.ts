import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { QUESTION_CANCELLED_ROLE_ENUM } from "../question.constant";

export class CancelledByDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "user", type: String })
  readonly user?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(QUESTION_CANCELLED_ROLE_ENUM)
  @ApiProperty({
    name: "role",
    type: String,
    enum: QUESTION_CANCELLED_ROLE_ENUM,
  })
  readonly role?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "reason", type: String })
  readonly reason?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "comment", type: String })
  readonly comment?: string;
}
