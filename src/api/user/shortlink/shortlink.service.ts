import { HttpService, Injectable } from "@nestjs/common";
import { ValidationService } from "src/utils/services/validation.service";
import { CreateShortlinkResponseDto } from "./dto/create-shortlink-response.dto";

interface ShortlinkInfo {
  consultation: string;
  user: string;
  expired: Date;
  userType: "patient" | "provider";
}

@Injectable()
export class ShortlinkService {
  constructor(
    private readonly http: HttpService,
    private readonly validationService: ValidationService
  ) {}

  async createConsultationShortlink(
    shortlinkInfo: ShortlinkInfo
  ): Promise<string> {
    const response = await this.http
      .post("/api/shortlink/consultation/create", shortlinkInfo)
      .toPromise();
    const { shortLink } = await this.validationService.validate(
      CreateShortlinkResponseDto,
      response.data.results
    );
    return shortLink;
  }
}
