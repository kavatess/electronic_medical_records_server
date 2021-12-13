import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { QuestionDocument } from "../schemas/question.schema";

@Injectable()
export class QuestionService extends BaseService<QuestionDocument> {
  constructor(
    @InjectModel("question")
    private readonly questionModel: Model<QuestionDocument>
  ) {
    super(questionModel);
  }
}
