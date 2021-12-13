import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FileInfoDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: "size", type: Number })
  readonly size?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "mimetype", type: String })
  readonly mimetype?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "path", type: String })
  readonly path?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "fileName", type: String })
  readonly fileName?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "bucket", type: String })
  readonly bucket?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "etag", type: String })
  readonly etag?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "url", type: String, required: true })
  readonly url?: string;
}
