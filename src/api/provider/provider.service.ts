import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { Provider, ProviderDocument } from "./schemas/provider.schema";

@Injectable()
export class ProviderService extends BaseService<ProviderDocument> {
  constructor(
    @InjectModel(Provider.name)
    private readonly providerModel: Model<ProviderDocument>
  ) {
    super(providerModel);
  }
}
