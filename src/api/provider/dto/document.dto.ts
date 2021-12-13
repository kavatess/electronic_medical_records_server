import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileInfoDto } from "src/common/dto/file-info.dto";

export class DocumentDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FileInfoDto)
  @ApiProperty({ name: "identity1", type: FileInfoDto })
  readonly identity1?: FileInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileInfoDto)
  @ApiProperty({ name: "identity2", type: FileInfoDto })
  readonly identity2?: FileInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileInfoDto)
  @ApiProperty({ name: "license", type: FileInfoDto })
  readonly license?: FileInfoDto;
}
