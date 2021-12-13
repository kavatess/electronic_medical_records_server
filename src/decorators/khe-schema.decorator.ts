import { applyDecorators } from "@nestjs/common";
import { ApiExtension } from "@nestjs/swagger";

export interface IKheSchemaApi {
  url: string;
  method: "post" | "get" | "delete" | "put";
  body?: string;
}

export interface IKheSchemaAttribute {
  key: string;
  label: string;
  placeholder: string;
  hint: string;
  order: number;
  format: string;
  validateRegex: string;
  editor: "javascript" | "json" | "html";
  enum: string[];
  isArray: boolean;
  isDefaultField: boolean;
  typeof: "string" | "object" | "number" | "relationship" | "date";
  noedit: boolean;
  searchable: boolean;
  filterable: boolean;
  sortable: boolean;
  hasEnum: boolean;
  isRequired: boolean;
  isSectionHeader: boolean;
  relationship?: IKheRelationship;
}

interface IKheRelationship {
  type: "refby" | "refto";
  path: string;
  key: string;
  entity: string;
}
export interface IKheSchema {
  dto: string;
  name?: string;
  view?: "table" | "calendar" | "card";
  labelField: string;
  defaultSearch?: string;
  defaultSize?: number;
  defaultSort?: string[];
  sortFields?: string[];
  searchFields?: string[];
  filterFields?: string[];
  initialFields?: string[];
  relationships?: IKheRelationship[];
  nodownload?: boolean;
  nobulkupdate?: boolean;
  noimport?: boolean;
  nodelete?: boolean;
  nocreate?: boolean;
  noedit?: boolean;
  api?: Record<string, IKheSchemaApi>;
  attributes?: Record<string, IKheSchemaAttribute>;
  generatedAt?: Date;
}
export function KheSchema(options: IKheSchema): any {
  const defaultOption = {
    api: {},
    view: "table",
    defaultSize: 10,
    attributes: {},
    labelField: "_id",
    nodownload: false,
    defaultSort: ["updatedAt"],
    sortFields: [],
    searchFields: [],
    filterFields: [],
    initialFields: [],
    nobulkupdate: false,
    noimport: false,
    nodelete: false,
    nocreate: false,
    noedit: false,
  };
  return applyDecorators(
    ApiExtension("x-khe", { ...defaultOption, ...options })
  );
}
