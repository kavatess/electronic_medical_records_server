import { Injectable } from "@nestjs/common";
import { ConsultationService } from "./consultation.service";
import { GenericService } from "src/api/generic/generic.service";
import { PrescriptionService } from "src/api/prescription/prescription.service";
import { RelationshipService } from "src/api/user/relationship/relationship.service";
import { FileManagementService } from "src/api/file-management/file-management.service";
import { GetDetailForDuduApiResponse } from "../models/get-detail-for-dudu-api.response.model";
import { Rating } from "../models/rating.model";
import { CalendarItem } from "../models/calendar-item.model";
import { Prescription } from "src/api/prescription/schemas/prescription.schema";
import { Consultation } from "../schemas/consultation.schema";
import { File } from "src/api/file-management/models/file.model";
import { Relationship } from "src/api/user/relationship/schemas/relationship.schema";

@Injectable()
export class GetDetailForDuduService {
  constructor(
    private readonly service: ConsultationService,
    private readonly genericService: GenericService,
    private readonly prescriptionService: PrescriptionService,
    private readonly fileService: FileManagementService,
    private readonly relationshipService: RelationshipService
  ) {}

  async getConsultDetailForDudu(
    consultId: string
  ): Promise<GetDetailForDuduApiResponse> {
    const consultation = await this.getConsultation(consultId);
    const [files, rating, time, prescriptions, relationship] =
      await Promise.all([
        this.getConsultFiles(consultId),
        this.getConsultRating(consultId),
        this.getConsultCalendarItem(consultId),
        this.getConsultPrescription(consultId),
        this.getConsultPatientRelationship(
          (consultation.user as any)._id,
          (consultation.patient as any)._id
        ),
      ]);
    return {
      ...consultation,
      time,
      prescriptions,
      files,
      rating,
      relationship,
    };
  }

  private async getConsultation(consultId: string): Promise<Consultation> {
    return await this.service.getDocumentById(consultId, {
      queryOptions: {
        populate: [
          {
            path: "provider",
            select: "name title mediumEnabled avatar",
          },
          {
            path: "providerUser",
            select: "name gender phone email avatar",
          },
          {
            path: "user",
            select: "name gender dob phone email avatar",
          },
          {
            path: "patient",
            select: "name gender dob phone email avatar",
          },
          {
            path: "diagnosis",
            select: "name slug code",
          },
        ],
        lean: true,
      },
    });
  }

  private async getConsultCalendarItem(
    consultId: string
  ): Promise<CalendarItem> {
    const [calendarItem] = await this.genericService.search("calendar-item", {
      limit: 1,
      sort: "-startTime",
      filter: {
        type: "consultation",
        consultation: consultId,
      },
      fields: [
        "title",
        "icon",
        "startTime",
        "endTime",
        "location",
        "description",
        "slotIndex",
        "slotDuration",
      ],
    });
    return calendarItem;
  }

  private async getConsultPrescription(
    consultId: string
  ): Promise<Prescription[]> {
    const prescriptions = await this.prescriptionService.find(
      {
        consultation: consultId,
      },
      null,
      {
        populate: ["drug", "route", "frequency"],
        lean: true,
      }
    );
    return prescriptions;
  }

  private async getConsultFiles(consultId: string): Promise<File[]> {
    return await this.fileService.getFilesOfMultipleConsult([consultId], {
      fields: ["name", "url", "description", "thumbnail", "user"],
    });
  }

  private async getConsultRating(consultId: string): Promise<Rating[]> {
    const rating = this.genericService.search("rating", {
      filter: {
        consultation: consultId,
        state: "published",
      },
      populate: {
        path: "ratingBy",
        select: "_id name",
      },
      fields: [
        "-state",
        "-consultation",
        "-provider",
        "-order",
        "-createdAt",
        "-createdBy",
      ],
    });
    return rating;
  }

  private async getConsultPatientRelationship(
    user: string,
    patient: string
  ): Promise<Relationship> {
    return await this.relationshipService.getUserPatientRelationship(
      user,
      patient
    );
  }
}
