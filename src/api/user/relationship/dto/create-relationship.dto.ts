import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsMongoId, IsIn } from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { RELATIONSHIP_ENUM } from "../relationship.module";

export class CreateRelationshipDto extends IBaseDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "user",
    type: String,
    required: true,
    properties: { refTo: { $ref: "user" } },
  })
  readonly user?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "related",
    type: String,
    required: true,
    properties: { refTo: { $ref: "user" } },
  })
  readonly related?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(RELATIONSHIP_ENUM)
  @ApiProperty({
    name: "relationship",
    type: String,
    enum: RELATIONSHIP_ENUM,
    required: true,
  })
  readonly relationship?: string;
}
