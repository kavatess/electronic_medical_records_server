import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsIn, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { CreateUserRoleDto } from "./create-user-role.dto";
export class UserRoleDto extends CreateUserRoleDto {
  @IsMongoId()
  @ApiProperty({
    type: String,
    example: "5fc4fed5454ae73afcae1c54",
    required: true,
    properties: { refTo: { $ref: "user" }, another: { pattern: "222" } },
  })
  readonly user?: string;

  @IsIn(["superadmin", "admin", "patient", "provider", "agent"])
  @ApiProperty({
    enum: ["admin", "patient", "provider", "agent"],
    default: "patient",
    required: false,
  })
  readonly roles?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: "5fc4fed5454ae73afcae1c54" })
  readonly _id?: Types.ObjectId;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: Date })
  readonly createdAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: Date })
  readonly updatedAt?: string;
}
