import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { FileQueryOptions } from "./models/file-query-options.model";
import { File } from "./models/file.model";
import { PinoLogger } from "nestjs-pino";
import { ConsultationFileInfo } from "./models/consultation-file-info.model";

@Injectable()
export class FileManagementService {
  constructor(
    private readonly http: HttpService,
    private readonly loggerService: PinoLogger
  ) {
    this.loggerService.setContext(FileManagementService.name);
  }

  async getFilesOfMultipleConsult(
    consultIdArr: string[],
    options: FileQueryOptions = {
      fields: ["tags", "url", "labels", "name", "mimetype", "user"],
    }
  ): Promise<File[]> {
    try {
      const fileLabelArr = consultIdArr
        .map((consultId) => `"consultation:${consultId.toString()}"`)
        .join(",");
      const uri =
        `/file/search` +
        `?filter={"labels":{"$in":[${fileLabelArr}]},"project":"emr"}` +
        `&count=true&fields=${options.fields.join(",")}` +
        `&limit=${options.limit || 100}`;
      const response = await this.http.get(encodeURI(uri)).toPromise();
      return response.data.results;
    } catch (err) {
      this.loggerService.error({
        msg: err,
      });
      return [];
    }
  }

  async countFilesOfMultipleConsult(
    consultIdArr: string[]
  ): Promise<ConsultationFileInfo[]> {
    const fileInfoArr = consultIdArr.map(
      (consultId) => new ConsultationFileInfo(consultId)
    );
    const fileArr = await this.getFilesOfMultipleConsult(consultIdArr);
    fileArr.forEach((file) => {
      file.labels.forEach((label) => {
        if (label.includes("consultation")) {
          const consultId = label.split(":")[1];
          const indexOfFile = fileInfoArr.findIndex(
            (fi) => fi.consultation === consultId
          );
          if (indexOfFile > -1) {
            const type = file.mimetype.split("/")[0];
            fileInfoArr[indexOfFile].files[type] += 1;
          }
        }
      });
    });
    return fileInfoArr;
  }
}
