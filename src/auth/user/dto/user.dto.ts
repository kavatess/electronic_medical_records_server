import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
export class UserDto extends CreateUserDto {
  @ApiProperty({ name: "search", type: String })
  readonly search: string;
}
