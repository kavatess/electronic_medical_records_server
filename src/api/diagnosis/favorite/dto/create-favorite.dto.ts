import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsMongoId,
  IsIn,
} from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { TYPE_ENUM } from "../favorite.module";

export class CreateFavoriteDto extends IBaseDto {
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
  @IsBoolean()
  @ApiProperty({ name: "share", type: Boolean })
  readonly share?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(TYPE_ENUM)
  @ApiProperty({ name: "type", type: String, enum: TYPE_ENUM })
  readonly type?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "value", type: String })
  readonly value?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "hit", type: Number })
  readonly hit?: number;
}
