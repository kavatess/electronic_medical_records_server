export interface IProperty {
  readonly name: string;
  readonly type: "number" | "string" | "boolean" | "Date" | "object" | "mongoId";
  readonly isArray?: boolean;
  readonly ref?: string;
  readonly enum?: any[];
  readonly required?: boolean;
  readonly example?: any;
  readonly default?: any;
  readonly properties?: IProperty[];
  readonly index?: boolean;
  readonly unique?: boolean;
  readonly min?: number;
  readonly max?: number;
  description?: string;
}

export class IConfig {
  name: string;
  output: string;
  controller?: boolean;
  dto?: boolean;
  schema?: boolean;
  "schema.publish-socket"?: boolean;
  "schema.publish-local"?: boolean;
  "schema.publish-queue"?: boolean;
  service?: boolean;
  subscriber?: boolean;
  properties: IProperty[];
}
