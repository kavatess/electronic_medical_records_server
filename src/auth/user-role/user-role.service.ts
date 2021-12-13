import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { UserRole, UserRoleDocument } from "./schemas/user-role.schema";

@Injectable()
export class UserRoleService extends BaseService<UserRoleDocument> {
  constructor(
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocument>
  ) {
    super(userRoleModel);
  }
}
