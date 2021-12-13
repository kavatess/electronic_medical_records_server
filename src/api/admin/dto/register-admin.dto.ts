import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsOptional } from "class-validator";

export class RegisterAdminDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: "5fc87b0ee383b0037c076ebb", required: false })
  readonly _id?: string;
}
