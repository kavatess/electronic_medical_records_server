import { Injectable } from "@nestjs/common";
import { ConsultationService } from "./consultation.service";
import { GenericService } from "src/api/generic/generic.service";
import { FileManagementService } from "src/api/file-management/file-management.service";
import { GetAllApiRequest } from "../models/get-all-api.request.model";
import { CalendarItem } from "../models/calendar-item.model";
import { Rating } from "../models/rating.model";
import { ConsultationDocument } from "../schemas/consultation.schema";
import { GetAllApiResponse } from "../models/get-all-api.response.model";
import { ObjectId } from "bson";

@Injectable()
export class GetAllService {
  constructor(
    private readonly service: ConsultationService,
    private readonly genericService: GenericService,
    private readonly fileService: FileManagementService
  ) {}

  async getAllConsultation(
    request: GetAllApiRequest
  ): Promise<GetAllApiResponse> {
    const { from, to, type, rating, states, fields, limit, skip } = request;
    const calendarItemArr = await this.getCalendarItems(from, to, type.$in);
    let consultIdArr = calendarItemArr.map((calendarItem) =>
      new ObjectId(calendarItem.consultation).toString()
    );

    const consultArr = await this.getConsultations(consultIdArr, states, type, {
      limit,
      skip,
      fields,
    });
    consultIdArr = consultArr.map((consult) =>
      new ObjectId(consult._id).toString()
    );

    const ratingArr = await this.getRatings(consultIdArr);
    const ignoredConsultId = rating
      ? ratingArr
          .filter((ra) => ra.rating > rating)
          .map((ra) => new ObjectId(ra.consultation).toString())
      : [];
    consultIdArr = consultIdArr.filter((id) => !ignoredConsultId.includes(id));

    const fileInfoArr = await this.fileService.countFilesOfMultipleConsult(
      consultIdArr
    );

    const consultations = [];
    consultArr.forEach((consultation) => {
      const consultId = new ObjectId(consultation._id).toString();
      if (ignoredConsultId.includes(consultId)) return;
      consultations.push({
        ...calendarItemArr.find(
          (item) => item.consultation.toString() === consultId
        ),
        rating: ratingArr.filter(
          (ra) => ra.consultation.toString() === consultId
        ),
        files: fileInfoArr.find((fi) => fi.consultation === consultId).files,
        ...consultation,
      });
    });

    return new GetAllApiResponse(consultations, {
      limit,
      skip,
    });
  }

  private async getCalendarItems(
    from: string,
    to: string,
    consultTypes: string[]
  ): Promise<CalendarItem[]> {
    const queryCond = {
      consultation: { $exists: true, $ne: null },
      type: "consultation",
    };
    const timeCond = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
    if (consultTypes.includes("question")) {
      Object.assign(queryCond, {
        $or: [
          {
            startTime: timeCond,
          },
          {
            createdAt: timeCond,
            startTime: null,
          },
        ],
      });
    } else {
      Object.assign(queryCond, {
        startTime: timeCond,
      });
    }

    return await this.genericService.search("calendar-item", {
      filter: queryCond,
      fields: ["_id", "startTime", "createdAt", "consultation"],
    });
  }

  private async getConsultations(
    consultIdArr: string[],
    states: string[],
    type: Record<string, any>,
    options?: {
      fields?: string[];
      limit?: number;
      skip?: number;
    }
  ): Promise<ConsultationDocument[]> {
    return await this.service.find(
      {
        _id: {
          $in: consultIdArr,
        },
        state: {
          $in: states,
        },
        test: false,
        type,
      },
      options.fields.join(" "),
      {
        limit: options.limit,
        skip: options.skip,
        populate: [
          {
            path: "provider",
            select: "title name",
          },
          {
            path: "user",
            select: "name phone gender",
          },
          {
            path: "patient",
            select: "name phone gender",
          },
          {
            path: "providerUser",
            select: "name phone",
          },
        ],
        lean: true,
      }
    );
  }

  private async getRatings(consultIdArr: string[]): Promise<Rating[]> {
    const queryCond = {
      consultation: {
        $in: consultIdArr,
      },
    };
    return await this.genericService.search("rating", {
      filter: queryCond,
      fields: ["rating", "type", "comment", "consultation"],
      lean: true,
    });
  }
}
