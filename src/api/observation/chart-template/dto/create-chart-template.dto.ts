import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty } from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";

export class CreateChartTemplateDto extends IBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "title", type: String, required: true })
  readonly title?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "slug", type: String })
  readonly slug?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "source", type: String })
  readonly source?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "template", type: String })
  readonly template?: any;
}
