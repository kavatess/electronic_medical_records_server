import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsMongoId,
  IsIn,
} from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { TYPE_ENUM } from "../conversation.module";

export class CreateConversationDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsMongoId()
  @ApiProperty({ name: "channel", type: String, required: true })
  readonly channel?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "user", type: String })
  readonly user?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(TYPE_ENUM)
  @ApiProperty({ name: "type", type: String, enum: TYPE_ENUM })
  readonly type?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "unread", type: Number })
  readonly unread?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "unreadMessage", type: String })
  readonly unreadMessage?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "unreadFrom", type: Date })
  readonly unreadFrom?: Date;
}
