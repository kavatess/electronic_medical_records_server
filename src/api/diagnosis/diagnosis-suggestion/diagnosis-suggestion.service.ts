import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import {
  DiagnosisSuggestion,
  DiagnosisSuggestionDocument,
} from "./schemas/diagnosis-suggestion.schema";

@Injectable()
export class DiagnosisSuggestionService extends BaseService<DiagnosisSuggestionDocument> {
  constructor(
    @InjectModel(DiagnosisSuggestion.name)
    private readonly diagnosissuggestionModel: Model<DiagnosisSuggestionDocument>
  ) {
    super(diagnosissuggestionModel);
  }
}
