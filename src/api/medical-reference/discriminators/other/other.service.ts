import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { OtherReferenceDocument } from "./schemas/other.schema";

@Injectable()
export class OtherReferenceService extends BaseService<OtherReferenceDocument> {
  constructor(
    @InjectModel("other")
    private readonly OtherReferenceModel: Model<OtherReferenceDocument>
  ) {
    super(OtherReferenceModel);
  }
}
