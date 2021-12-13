import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import {
  PatientNote,
  PatientNoteDocument,
} from "./schemas/patient-note.schema";

@Injectable()
export class PatientNoteService extends BaseService<PatientNoteDocument> {
  constructor(
    @InjectModel(PatientNote.name)
    private readonly patientnoteModel: Model<PatientNoteDocument>
  ) {
    super(patientnoteModel);
  }
}
