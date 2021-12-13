import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { Channel, ChannelDocument } from "./schemas/channel.schema";

@Injectable()
export class ChannelService extends BaseService<ChannelDocument> {
  constructor(
    @InjectModel(Channel.name)
    private readonly channelModel: Model<ChannelDocument>
  ) {
    super(channelModel);
  }

  async createProviderOnemrChannel(
    providerId: string
  ): Promise<ChannelDocument> {
    return await this.findOneOrCreate({
      platform: "onemr",
      provider: providerId,
    });
  }
}
