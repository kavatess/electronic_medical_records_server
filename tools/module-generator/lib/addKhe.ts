import { IKheSchema } from "src/decorators/khe-schema.decorator";
import { IConfig, IProperty } from "../config.interface";

export function addKhe(module: IConfig) {
  let kheSchema: IKheSchema = {
    dto: `${module.name.toUpperCase()}Dto`,
    labelField: "name",
    searchFields: [],
    filterFields: [],
    sortFields: [],
    defaultSort: ["-updatedAt"],
    view: "table",
    initialFields: ["_id", "updatedBy", "updatedAt"],
  };

  module.properties.forEach((property) => {
    if (property.type == "string") {
      kheSchema.searchFields.push(property.name);
    }
    kheSchema.filterFields.push(property.name);
    kheSchema.sortFields.push(property.name);
  });

  return `@KheSchema(${JSON.stringify(kheSchema)})`;
}
