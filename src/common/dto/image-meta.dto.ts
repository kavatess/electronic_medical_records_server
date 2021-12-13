import { IsOptional, IsNotEmpty, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

class OgDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "title", type: String })
  readonly title?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "description", type: String })
  readonly description?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "image", type: String })
  readonly image?: string;
}

export class ImageMetaDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "title", type: String })
  readonly title?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "description", type: String })
  readonly description?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "image", type: String })
  readonly image?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OgDto)
  @ApiProperty({ name: "og", type: OgDto })
  readonly og?: OgDto;
}
