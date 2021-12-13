import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { WEBVIEW_HEIGHT_RATIO_ENUM } from "../channel.module";
import { WEBVIEW_SHARE_BUTTON_ENUM } from "../channel.module";

export class FacebookHomeUrlDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "url", type: String })
  readonly url?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(WEBVIEW_HEIGHT_RATIO_ENUM)
  @ApiProperty({
    name: "webview_height_ratio",
    type: String,
    enum: WEBVIEW_HEIGHT_RATIO_ENUM,
  })
  readonly webview_height_ratio?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(WEBVIEW_SHARE_BUTTON_ENUM)
  @ApiProperty({
    name: "webview_share_button",
    type: String,
    enum: WEBVIEW_SHARE_BUTTON_ENUM,
  })
  readonly webview_share_button?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "in_test", type: Boolean })
  readonly in_test?: boolean;
}
