import { ApiProperty } from "@nestjs/swagger";
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
} from "class-validator";
import { Types } from "mongoose";
import { IBaseDto } from "src/hooks/database/dto/base.dto";

export class CreateUserDto extends IBaseDto {
  @IsNotEmpty()
  @ApiProperty({
    name: "name",
    type: String,
    required: true,
    example: "Robert Landon",
  })
  readonly name?: string;

  @IsDateString()
  @ApiProperty({ name: "dob", type: Date })
  readonly dob: Date;

  @IsNotEmpty()
  @ApiProperty({
    name: "gender",
    type: String,
    enum: ["M", "F"],
  })
  readonly gender: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "phone", type: String })
  readonly phone: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "email", type: String })
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "username", type: String })
  readonly username: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "password", type: String })
  readonly password: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "countryCode", type: Date, example: "84" })
  readonly countryCode: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "provider", type: Types.ObjectId })
  provider: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "isAdmin", type: Boolean, default: false })
  isAdmin: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "createAccount", type: Boolean, default: false })
  createAccount: boolean;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: "5fc4fed5454ae73afcae1c54" })
  readonly _id?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: "5fc4fed5454ae73afcae1c54" })
  readonly createdBy?: string;
}
