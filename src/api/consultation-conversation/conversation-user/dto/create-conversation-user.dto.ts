import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsIn,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { FileInfoDto } from "src/common/dto/file-info.dto";
import { ROLE_ENUM } from "../conversation-user.module";
import { CHATPOLICY_ENUM } from "../conversation-user.module";
import { STATE_ENUM } from "../conversation-user.module";

export class CreateConversationUserDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileInfoDto)
  @ApiProperty({ name: "avatar", type: FileInfoDto })
  readonly avatar?: FileInfoDto;

  @IsMongoId()
  @ApiProperty({ name: "conversation", type: String, required: true })
  readonly conversation?: string;

  @IsMongoId()
  @ApiProperty({ name: "user", type: String, required: true })
  readonly user?: string;

  @IsNotEmpty()
  @IsIn(ROLE_ENUM)
  @ApiProperty({ name: "role", type: String, enum: ROLE_ENUM, required: true })
  readonly role?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(CHATPOLICY_ENUM)
  @ApiProperty({ name: "chatPolicy", type: String, enum: CHATPOLICY_ENUM })
  readonly chatPolicy?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(STATE_ENUM)
  @ApiProperty({ name: "state", type: String, enum: STATE_ENUM })
  readonly state?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "search", type: String })
  readonly search?: string;
}
