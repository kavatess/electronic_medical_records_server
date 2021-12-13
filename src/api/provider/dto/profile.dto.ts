import { ApiProperty } from "@nestjs/swagger";
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from "class-validator";

export class ProfileDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "education", type: String })
  readonly education?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "experience", type: String })
  readonly experience?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "portrait", type: String })
  readonly portrait?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "tagLine", type: String })
  readonly tagLine?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "diagnosis", type: String, isArray: true })
  readonly diagnosis?: string[];

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "experiencesDescription", type: String })
  readonly experiencesDescription?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ name: "startWork", type: Date })
  readonly startWork?: Date;
}
