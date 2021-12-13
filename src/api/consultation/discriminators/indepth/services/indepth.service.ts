import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { IndepthDocument } from "../schemas/indepth.schema";

@Injectable()
export class IndepthService extends BaseService<IndepthDocument> {
  constructor(
    @InjectModel("indepth")
    private readonly indepthModel: Model<IndepthDocument>
  ) {
    super(indepthModel);
  }
}
