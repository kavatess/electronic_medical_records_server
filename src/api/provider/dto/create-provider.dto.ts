import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsIn,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { IBaseDto } from "src/hooks/database/dto/base.dto";
import { ProfileDto } from "./profile.dto";
import { DocumentDto } from "./document.dto";
import { FileInfoDto } from "src/common/dto/file-info.dto";
import { TITLE_ENUM } from "../provider.module";
import { CONTRACT_ENUM } from "../provider.module";
import { CONSULTTIME_ENUM } from "../provider.module";
import { MediumEnabledDto } from "./medium-enabled.dto";

export class CreateProviderDto extends IBaseDto {
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String, required: true })
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(TITLE_ENUM)
  @ApiProperty({ name: "title", type: String, enum: TITLE_ENUM })
  readonly title?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "slug", type: String })
  readonly slug?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "active", type: Boolean })
  readonly active?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(CONTRACT_ENUM)
  @ApiProperty({ name: "contract", type: String, enum: CONTRACT_ENUM })
  readonly contract?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "published", type: Boolean })
  readonly published?: boolean;

  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({ name: "spoken", type: String, isArray: true })
  readonly spoken?: string[];

  @IsOptional()
  @IsNumber()
  @IsIn(CONSULTTIME_ENUM)
  @ApiProperty({ name: "consultTime", type: Number, enum: CONSULTTIME_ENUM })
  readonly consultTime?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediumEnabledDto)
  @ApiProperty({ name: "consultTime", type: Number, enum: CONSULTTIME_ENUM })
  readonly mediumEnabled?: MediumEnabledDto;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "bookingDelay", type: Number })
  readonly bookingDelay?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "adminOrder", type: Number })
  readonly adminOrder?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "order", type: Number })
  readonly order?: number;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "specialty", type: String, isArray: true })
  readonly specialty?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => FileInfoDto)
  @ApiProperty({ name: "avatar", type: FileInfoDto })
  readonly avatar?: FileInfoDto;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "joinDate", type: Date })
  readonly joinDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDto)
  @ApiProperty({ name: "profile", type: ProfileDto })
  readonly profile?: ProfileDto;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "highlight", type: String })
  readonly highlight?: string;

  @IsMongoId()
  @ApiProperty({
    name: "user",
    type: String,
    required: true,
    properties: { refTo: { $ref: "user" } },
  })
  readonly user?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentDto)
  @ApiProperty({ name: "document", type: DocumentDto })
  readonly document?: DocumentDto;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "licenceNumber", type: String })
  readonly licenceNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "identityNumber", type: String })
  readonly identityNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "tax", type: String })
  readonly tax?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "location", type: String, isArray: true })
  readonly location?: string[];
}
