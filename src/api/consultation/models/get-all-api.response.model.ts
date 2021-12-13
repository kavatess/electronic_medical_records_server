import { ConsultFileInfo } from "src/api/file-management/models/consultation-file-info.model";
import { Consultation } from "../schemas/consultation.schema";
import { CalendarItem } from "./calendar-item.model";
import { Rating } from "./rating.model";

export class Pagination {
  pageSize: number;
  pageIndex: number;
  total: number;
}

export interface ExtendedConsultation extends Consultation, CalendarItem {
  ratings: Rating[];
  files: ConsultFileInfo[];
}

export class GetAllApiResponse {
  count: number;
  pagination: Pagination;
  consultations: ExtendedConsultation[];

  constructor(
    consultations: ExtendedConsultation[],
    options: {
      limit: number;
      skip: number;
    }
  ) {
    this.consultations = consultations;
    this.count = consultations.length;
    this.pagination = {
      pageSize: options.limit,
      pageIndex: Math.ceil(Number(options.skip) / Number(options.limit)) || 1,
      total: this.count,
    };
  }
}
