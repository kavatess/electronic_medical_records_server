import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsMongoId,
  IsIn,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { DefaultDto } from "./default.dto";
import { FacebookDto } from "./facebook.dto";
import { PLATFORM_ENUM } from "../channel.module";

export class CreateChannelDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(PLATFORM_ENUM)
  @ApiProperty({
    name: "platform",
    type: String,
    enum: PLATFORM_ENUM,
    required: true,
  })
  readonly platform?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "provider", type: String })
  readonly provider?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "unread", type: Number })
  readonly unread?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "picture", type: String })
  readonly picture?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "bot", type: Boolean })
  readonly bot?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => DefaultDto)
  @ApiProperty({ name: "default", type: DefaultDto })
  readonly default?: DefaultDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FacebookDto)
  @ApiProperty({ name: "facebook", type: FacebookDto })
  readonly facebook?: FacebookDto;
}
