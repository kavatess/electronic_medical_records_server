import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {
    super(userModel);
  }

  async getUserRole(userId: string): Promise<string> {
    const user = await this.findById(
      userId,
      "isAdmin provider createAccount",
      {}
    );
    if (!user) return null;
    if (user.isAdmin) return "admin";
    else if (user.provider) return "provider";
    else if (user.createAccount) return "user";
    return "patient";
  }
}
