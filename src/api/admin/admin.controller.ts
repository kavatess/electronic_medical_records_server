import {
  Body,
  Controller,
  Get,
  HttpService,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { RegisterAdminDto } from "./dto/register-admin.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { UserService } from "../../auth/user/user.service";
import { UserRoleService } from "../../auth/user-role/user-role.service";
import { UserRoleDto } from "../../auth/user-role/dto/user-role.dto";
import { AdminService } from "./admin.service";
import fs from "fs";
import path from "path";
@ApiTags("admin")
@Controller("admin")
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly httpService: HttpService,
    private readonly service: AdminService
  ) {}

  @Post("register")
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: UserRoleDto })
  @ApiErrorResponses(["409"])
  async create(@Body() user: RegisterAdminDto): Promise<any> {
    const existedSuperAdminRole = await this.userRoleService.findOne({
      role: "superadmin",
    });
    if (existedSuperAdminRole)
      throw new Error("409 you cannot register a new superadmin");
    let existedSuperAdmin = await this.userService.findOne(user);
    if (!existedSuperAdmin)
      existedSuperAdmin = await this.userService.create(user);
    return this.userRoleService.create({
      user: existedSuperAdmin._id,
      role: "superadmin",
    });
  }

  @Get("/:resource/schema")
  @ApiOkResponse()
  async getSchema(
    @Param() params: { [key: string]: string },
    @Res() res: Response
  ): Promise<any> {
    res.header("Content-Type", "application/json");
    res.attachment(params.resource + ".json");
    res.send(await this.service.getSchema(params.resource));
  }

  @Get("/version")
  async getVersion(): Promise<string> {
    return fs
      .readFileSync(path.join(__dirname, "../../../version.txt"))
      .toString();
  }
}
