import { Prescription } from "src/api/prescription/schemas/prescription.schema";
import { Consultation } from "../schemas/consultation.schema";
import { CalendarItem } from "./calendar-item.model";
import { Rating } from "./rating.model";

export class GetDetailForOnemrApiResponse {
  Rating: Rating[];
  Consultation: Consultation;
  Prescription: Prescription[];
  CalendarItem: CalendarItem;
}
