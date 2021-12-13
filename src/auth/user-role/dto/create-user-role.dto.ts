import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { Roles } from "src/common/constants";

export class CreateUserRoleDto {
  @IsMongoId()
  @ApiProperty({
    example: "5fc4fed5454ae73afcae1c54",
    required: true,
    properties: { refTo: { $ref: "user" }, another: { pattern: "222" } },
    type: String,
  })
  readonly user?: string;

  @IsIn(Roles)
  @ApiProperty({ enum: Roles, default: "patient", required: true })
  readonly role?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: "5fc4fed5454ae73afcae1c54" })
  readonly _id?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: "5fc4fed5454ae73afcae1c54" })
  createdBy?: string;
}
