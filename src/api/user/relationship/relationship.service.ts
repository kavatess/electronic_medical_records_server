import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import {
  Relationship,
  RelationshipDocument,
} from "./schemas/relationship.schema";

@Injectable()
export class RelationshipService extends BaseService<RelationshipDocument> {
  constructor(
    @InjectModel(Relationship.name)
    private readonly relationshipModel: Model<RelationshipDocument>
  ) {
    super(relationshipModel);
  }

  async getUserPatientRelationship(
    user: string,
    patient: string
  ): Promise<RelationshipDocument> {
    return await this.findOne(
      {
        user,
        related: patient,
      },
      null
    );
  }

  async createRelationship(
    user: string,
    related: string,
    relationship: string
  ): Promise<RelationshipDocument> {
    return await this.findOneOrCreate({ user, related, relationship });
  }
}
