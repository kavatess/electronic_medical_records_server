import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "bson";
import { Model } from "mongoose";
import { ConsultationService } from "src/api/consultation/services/consultation.service";
import { BaseService } from "src/hooks/database/base.service";
import { XAuthUserService } from "src/utils/services/x-auth-user-validation.service";
import { CreatePrescriptionDto } from "./dto/create-prescription.dto";
import {
  Prescription,
  PrescriptionDocument,
} from "./schemas/prescription.schema";
import { DrugService } from "src/api/prescription/modules/drug/drug.service";
import { RxFrequencyReferenceService } from "src/api/medical-reference/discriminators/rx-frequency/rx-frequency.service";
import { RouteOfAdministrationReferenceService } from "src/api/medical-reference/discriminators/route-of-administration/route-of-administration.service";

enum PrescriptionBaseErrMsg {
  CREATE = "Error while creating prescription",
}

@Injectable()
export class PrescriptionService extends BaseService<PrescriptionDocument> {
  constructor(
    @InjectModel(Prescription.name)
    private readonly prescriptionModel: Model<PrescriptionDocument>,
    private readonly drugService: DrugService,
    private readonly consultationService: ConsultationService,
    private readonly rxFrequencyService: RxFrequencyReferenceService,
    private readonly routeOfAdminService: RouteOfAdministrationReferenceService,
    private readonly xAuthUserService: XAuthUserService
  ) {
    super(prescriptionModel);
  }

  async createPrescription(
    prescription: CreatePrescriptionDto,
    xAuthUser: string
  ): Promise<Prescription> {
    const [_drug, consultation, _frequency, _route] = await Promise.all([
      this.drugService.getDocumentById(prescription.drug, {
        baseErrMsg: PrescriptionBaseErrMsg.CREATE,
      }),
      this.consultationService.getDocumentById(prescription.consultation, {
        projections: "providerUser",
        baseErrMsg: PrescriptionBaseErrMsg.CREATE,
      }),
      prescription.frequency
        ? this.rxFrequencyService.getDocumentById(prescription.frequency, {
            baseErrMsg: PrescriptionBaseErrMsg.CREATE,
          })
        : Promise.resolve(null),
      prescription.route
        ? this.routeOfAdminService.getDocumentById(prescription.route, {
            baseErrMsg: PrescriptionBaseErrMsg.CREATE,
          })
        : Promise.resolve(null),
    ]);

    if (
      new ObjectId(xAuthUser).toString() !==
      new ObjectId(consultation.providerUser).toString()
    ) {
      await this.xAuthUserService.validateIfxAuthUserIsAdmin(xAuthUser, {
        baseErrMsg: PrescriptionBaseErrMsg.CREATE,
      });
    }

    return await this.create(prescription, {
      createdBy: xAuthUser,
      updatedBy: xAuthUser,
    });
  }
}
