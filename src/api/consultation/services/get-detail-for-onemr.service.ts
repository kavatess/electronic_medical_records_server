import moment from "moment";
import { Injectable } from "@nestjs/common";
import { ConsultationService } from "./consultation.service";
import { GenericService } from "src/api/generic/generic.service";
import { PrescriptionService } from "src/api/prescription/prescription.service";
import { Rating } from "../models/rating.model";
import { CalendarItem } from "../models/calendar-item.model";
import { Prescription } from "src/api/prescription/schemas/prescription.schema";
import { GetDetailForOnemrApiResponse } from "../models/get-detail-for-onemr-api.response.model";
import { Consultation } from "../schemas/consultation.schema";

@Injectable()
export class GetDetailForOnemrService {
  constructor(
    private readonly service: ConsultationService,
    private readonly genericService: GenericService,
    private readonly prescriptionService: PrescriptionService
  ) {}

  async getConsultDetailForOnemr(
    consultId: string
  ): Promise<GetDetailForOnemrApiResponse> {
    const Consultation = await this.getConsultation(consultId);
    const [Rating, Prescription, CalendarItem] = await Promise.all([
      this.getConsultRating(consultId),
      this.getConsultPrescription(consultId),
      this.getConsultCalendarItem(consultId, Consultation.type),
    ]);
    return { Consultation, CalendarItem, Prescription, Rating };
  }

  private async getConsultation(consultId: string): Promise<Consultation> {
    return await this.service.getDocumentById(consultId, {
      queryOptions: {
        populate: [
          {
            path: "conversation",
            select: "channel user",
          },
          {
            path: "diagnosis",
            select: "name slug locale",
          },
          {
            path: "user",
            select: "name avatar",
          },
          {
            path: "provider",
            select: "name avatar title user slug",
          },
          {
            path: "patient",
            select: "name dob gender avatar",
          },
        ],
        lean: true,
      },
    });
  }

  private async getConsultCalendarItem(
    consultId: string,
    consultType: string
  ): Promise<CalendarItem> {
    const filterCond = {
      type: "consultation",
      consultation: consultId,
    };
    if (consultType === "home-treatment") {
      Object.assign(filterCond, {
        startTime: {
          $gte: moment().startOf("day"),
          $lte: moment().endOf("day"),
        },
      });
    }
    const [calendarItem] = await this.genericService.search("calendar-item", {
      limit: 1,
      filter: filterCond,
      fields: [
        "startTime",
        "endTime",
        "calendar",
        "slotIndex",
        "slotDuration",
        "createdAt",
      ],
    });
    if (consultType === "question") {
      Object.assign(calendarItem, {
        startTime: calendarItem.createdAt,
      });
    }
    return calendarItem;
  }

  private async getConsultPrescription(
    consultId: string
  ): Promise<Prescription[]> {
    const prescriptions = await this.prescriptionService.find(
      {
        consultation: consultId,
      },
      "drug route take duration frequency note unit followDirection",
      {
        populate: [
          {
            path: "drug",
            select: "name",
          },
          {
            path: "route",
            select: "slug name",
          },
          {
            path: "frequency",
            select: "slug name",
          },
        ],
        lean: true,
      }
    );
    return prescriptions;
  }

  private async getConsultRating(consultId: string): Promise<Rating[]> {
    const rating = this.genericService.search("rating", {
      filter: {
        consultation: consultId,
        type: "consultation",
      },
      fields: ["ratingBy", "rating", "comment", "state", "type", "provider"],
    });
    return rating;
  }
}
