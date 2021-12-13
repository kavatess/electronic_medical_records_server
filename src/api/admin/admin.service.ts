import { HttpService, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import {
  IKheSchema,
  IKheSchemaAttribute,
} from "src/decorators/khe-schema.decorator";

@Injectable()
export class AdminService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AdminService.name);
  }

  private prepareSchema(schemaProperty: any, initial: any): any {
    const property = initial.key;
    let hint = "";
    let placeholder = "enter a " + schemaProperty.type;
    const label = property
      .split(/(?=[A-Z]|\.)/g)
      .map((i: string) => i.replace(".", ""))
      .map((i: string) => i.charAt(0).toUpperCase() + i.substr(1).toLowerCase())
      .join(" ");
    let hasEnum = false;
    if (schemaProperty.enum && schemaProperty.enum.length > 0) hasEnum = true;
    if (
      schemaProperty.items &&
      schemaProperty.items.enum &&
      schemaProperty.items.enum.length > 0
    )
      hasEnum = true;

    let enumValues = [];
    if (schemaProperty.enum) enumValues = schemaProperty.enum;
    if (schemaProperty.items && schemaProperty.items.enum)
      enumValues = schemaProperty.items.enum;

    let pattern = schemaProperty["pattern"];
    let format = schemaProperty["format"];

    if (schemaProperty.enum)
      hint = "accepted: " + schemaProperty.enum.join(", ");
    else if (schemaProperty.default)
      hint = "example: " + schemaProperty.default;
    else if (schemaProperty.example)
      if (schemaProperty.example instanceof Object) {
        hint = "example: " + JSON.stringify(schemaProperty.example);
      } else {
        hint = "example: " + schemaProperty.example;
      }
    else if (schemaProperty.typeof == "date") {
      hint = "yyyy-mm-dd";
      placeholder = "enter or pick a date/time";
      pattern = "^\\d{4}-\\d{2}-\\d{2}$";
      format = "HH:mm DD-MMM-YY";
    }

    // editor for string field
    let editor = undefined;
    if (
      schemaProperty["properties"] &&
      schemaProperty["properties"]["editor"]
    ) {
      editor = {
        language: "json",
        height: 500,
        lib: "codemirror",
      };
      if (schemaProperty["properties"]["editor"]["$ref"] == "javascript")
        editor = {
          language: "javascript",
          height: 500,
          lib: "codemirror",
        };
      if (schemaProperty["properties"]["editor"]["$ref"] == "json")
        editor = {
          language: "json",
          height: 500,
          lib: "codemirror",
        };
      if (schemaProperty["properties"]["editor"]["$ref"] == "html")
        editor = {
          language: "html",
          height: 500,
          lib: "tinymce",
        };
    }

    let attributeType = schemaProperty.type;

    // refTo
    let relationship = undefined;
    if (schemaProperty["properties"] && schemaProperty["properties"]["refTo"]) {
      relationship = {
        type: "refto",
        entity: schemaProperty["properties"]["refTo"]["$ref"],
        key: "_id",
        // labelField : ""
      };
      attributeType = "relationship";
      placeholder =
        "enter id, or search for " +
        schemaProperty["properties"]["refTo"]["$ref"];
    }

    if (schemaProperty["format"] == "date-time") {
      attributeType = "date";
      hint = "yyyy-mm-dd";
      placeholder = "enter or pick a date/time";
      pattern = "^\\d{4}-\\d{2}-\\d{2}$";
      format = "HH:mm DD-MMM-YY";
    }

    const defaultValue = schemaProperty.default;
    const isArray = schemaProperty.type === "array";
    const noedit = schemaProperty.readOnly ? true : false;
    return {
      ...initial,
      label: label || property,
      placeholder: placeholder,
      hint: hint,
      order: initial.order,
      format: format,
      editor: editor,
      validateRegex: pattern,
      defaultValue: defaultValue,
      enum: enumValues,
      isArray: isArray,
      typeof: attributeType,
      relationship: relationship,
      noedit: noedit,
      hasEnum: hasEnum,
      isSectionHeader: false,
    } as IKheSchemaAttribute;
  }

  async getSchema(resource: string): Promise<any> {
    const api = (
      await this.httpService
        .get(
          "http://localhost:" +
            this.configService.get("app.port") +
            (this.configService.get("app.base")
              ? "/" + this.configService.get("app.base")
              : "") +
            "/openapi-json"
        )
        .toPromise()
    ).data;
    const paths = Object.keys(api.paths);
    this.logger.trace({ msg: `Extracted ${paths.length} paths from open api` });
    // transform api
    let transform = [];
    paths.forEach((path) => {
      const operations = Object.keys(api.paths[path]);
      operations.forEach((method) => {
        const item = { path: path };
        item["method"] = method.toUpperCase();
        item["operationId"] =
          api.paths[path][method]["operationId"].split("_")[1];
        item["tags"] = api.paths[path][method]["tags"];
        item["x-khe"] = api.paths[path][method]["x-khe"];
        transform.push(item);
      });
    });

    // filter resource tag
    transform = transform.filter((i) => i["tags"].includes(resource));
    this.logger.trace({
      msg: `API with tags ${resource}: ${transform.length}`,
    });
    if (transform.length == 0)
      throw Error("404 not found api matching this tag");
    const xkhe: IKheSchema = transform
      .filter((i) => i["x-khe"])
      .reduce((acc, current) => {
        return { ...acc["x-khe"], ...current["x-khe"] };
      }, {});

    const response: IKheSchema = {
      name: resource,
      generatedAt: new Date(),
      ...xkhe,
    };

    // prepare apis
    transform.forEach((i) => {
      response["api"][i.operationId] = {
        url: i.path.replace("_id", "id"),
        method: i.method,
        body: "{{data}}",
      };
    });

    // prepare attributes
    const schema = api.components.schemas[xkhe.dto];
    let order = 0;
    Object.keys(schema.properties).forEach((property) => {
      if (
        schema.properties[property]["properties"] &&
        schema.properties[property]["properties"]["nested"]
      ) {
        const nestedDto = schema.properties[property].allOf[0]["$ref"]
          .split("/")
          .slice(-1)[0];
        const nestedSchema = api.components.schemas[nestedDto];
        Object.keys(nestedSchema.properties).forEach((nestedProperty) => {
          const nestedKey = property + "." + nestedProperty;
          response.attributes[nestedKey] = this.prepareSchema(
            nestedSchema.properties[nestedProperty],
            {
              order: order,
              key: nestedKey,
              isDefaultField: response["initialFields"].includes(nestedKey),
              searchable: response["searchFields"].includes(nestedKey),
              filterable: response["filterFields"].includes(nestedKey),
              sortable: response["sortFields"].includes(nestedKey),
              isRequired: nestedSchema["required"]
                ? nestedSchema["required"].includes(nestedProperty)
                : false,
            }
          );
          order++;
        });
      } else {
        response.attributes[property] = this.prepareSchema(
          schema.properties[property],
          {
            order: order,
            key: property,
            isDefaultField: response["initialFields"].includes(property),
            searchable: response["searchFields"].includes(property),
            filterable: response["filterFields"].includes(property),
            sortable: response["sortFields"].includes(property),
            isRequired: schema["required"]
              ? schema["required"].includes(property)
              : false,
          }
        );
        order++;
      }
    });
    // refBy
    if (xkhe.relationships && xkhe.relationships.length > 0) {
      response.attributes["referenced-by-entities"] = {
        isSectionHeader: true,
        label: " Referenced By Entities",
        placeholder: undefined,
        hint: undefined,
        format: undefined,
        validateRegex: undefined,
        editor: undefined,
        enum: undefined,
        hasEnum: false,
        isArray: false,
        noedit: false,
        typeof: "string",
        order: order,
        key: "referenced-by-entities",
        isDefaultField: false,
        searchable: false,
        filterable: false,
        sortable: false,
        isRequired: false,
      };
      order++;
      xkhe.relationships.forEach((relationship) => {
        if (relationship.type == "refby") {
          response.attributes[relationship.entity] = {
            label: relationship.entity
              .split(/(?=[A-Z]|\.|\-)/g)
              .map((i) => i.replace(".", ""))
              .map((i) => i.replace("-", ""))
              .map((i) => i.charAt(0).toUpperCase() + i.substr(1).toLowerCase())
              .join(" "),
            placeholder: undefined,
            hint: undefined,
            format: undefined,
            validateRegex: undefined,
            editor: undefined,
            enum: undefined,
            hasEnum: false,
            isArray: true,
            isSectionHeader: false,
            noedit: false,
            typeof: "relationship",
            relationship: {
              type: "refby",
              entity: relationship.entity,
              path: relationship.path,
              key: relationship.key,
            },
            order: order,
            key: relationship.entity,
            isDefaultField: false,
            searchable: false,
            filterable: false,
            sortable: true,
            isRequired: false,
          };
        }
        order++;
      });
    }
    return response;
  }
}
