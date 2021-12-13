import {
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
} from "class-validator";
import { Header } from "./header.dto";

export class RabbitMessageDto<IQuery, IData> {
  @IsOptional()
  @IsNotEmpty()
  readonly _routingKey?: string;

  @IsOptional()
  readonly _error?: any;

  @IsOptional()
  @IsObject()
  readonly headers?: Header;

  @IsOptional()
  @IsNotEmptyObject()
  readonly query?: IQuery;

  @IsOptional()
  @IsNotEmptyObject()
  readonly data?: IData;

  @IsOptional()
  @IsNotEmptyObject()
  readonly body?: IData;

  @IsOptional()
  @IsDateString()
  readonly timestamp?: string;
}
