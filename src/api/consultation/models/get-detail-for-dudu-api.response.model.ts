import { File } from "src/api/file-management/models/file.model";
import { Prescription } from "src/api/prescription/schemas/prescription.schema";
import { Relationship } from "src/api/user/relationship/schemas/relationship.schema";
import { Consultation } from "../schemas/consultation.schema";
import { CalendarItem } from "./calendar-item.model";
import { Rating } from "./rating.model";

export class GetDetailForDuduApiResponse extends Consultation {
  time: CalendarItem;
  prescriptions: Prescription[];
  files: File[];
  rating: Rating[];
  relationship: Relationship;
}
