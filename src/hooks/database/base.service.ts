import { Injectable, NotFoundException } from "@nestjs/common";
import {
  Document,
  FilterQuery,
  Model,
  ObjectId,
  QueryCursor,
  QueryOptions,
} from "mongoose";
import { Parser } from "json2csv";
import flat from "flat";
import { QueryServiceOptions } from "./dto/query-service-options.model";

/**
 * Abstract base service that other services can extend to provide base CRUD
 * functionality such as to create, find, update and delete data.
 */
@Injectable()
export abstract class BaseService<T extends Document> {
  private readonly modelName: string;

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   *
   * @param {Model} model - The injected model.
   */
  constructor(private readonly model: Model<T>) {
    for (const modelName of Object.keys(model.collection.conn.models)) {
      if (model.collection.conn.models[modelName] === this.model) {
        this.modelName = modelName;
        break;
      }
    }
  }

  async findOne(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: any | null = "_id",
    options: QueryOptions = {
      lean: { autopopulate: true },
    }
  ): Promise<T> {
    return await this.model.findOne(
      conditions as FilterQuery<T>,
      projection,
      options
    );
  }

  async findById(
    documentId: string | ObjectId,
    projection: any | null,
    options: QueryOptions = {
      lean: { autopopulate: true },
    }
  ): Promise<T> {
    return await this.model.findById(documentId, projection, options);
  }

  async find(
    conditions: Partial<Record<keyof T, unknown>>,
    projection?: string | Record<string, unknown>,
    options: Record<string, unknown> = {
      lean: { autopopulate: true },
      skip: 0,
      limit: 0,
    }
  ): Promise<T[]> {
    options.skip = Number(options.skip) || 0;
    options.limit = Number(options.limit) || 0;
    return await this.model.find(
      conditions as FilterQuery<T>,
      projection,
      options
    );
  }

  async getDocumentById(
    docId: string,
    { baseErrMsg, projections, queryOptions }: QueryServiceOptions = {}
  ): Promise<T> {
    const doc = await this.findById(docId, projections, queryOptions);
    if (!doc)
      throw new NotFoundException(
        `${baseErrMsg || "Error"}: Not found ${this.modelName}(${docId})`
      );
    return doc;
  }

  async distinct(
    conditions: Partial<Record<keyof T, unknown>>,
    field: string
  ): Promise<string[]> {
    return this.model.find(conditions as FilterQuery<T>).distinct(field);
  }

  async getCsv(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown>,
    options: Record<string, unknown> = {
      lean: true,
      skip: 0,
      limit: 10,
    }
  ): Promise<T[]> {
    if (options.skip) options.skip = parseInt(options.skip as string);
    else options.skip = 0;

    if (options.limit) options.limit = parseInt(options.limit as string);
    else options.limit = 1;

    const data = await this.model
      .find(conditions as FilterQuery<T>, projection, options)
      .lean({ autopopulate: true });
    const json2csv = new Parser();
    return json2csv.parse(data);
  }

  async countDocuments(
    conditions: Partial<Record<keyof T, unknown>>
  ): Promise<number> {
    return this.model.countDocuments(conditions as FilterQuery<T>);
  }

  async create(
    doc: Partial<Record<keyof T, unknown>>,
    meta?: { updatedBy?: string; createdBy: string; _cid?: string }
  ): Promise<T> {
    const item = new this.model();
    item.set(doc);
    if (meta) item.set(meta);
    const savedItem = await item.save();
    return await this.model.findOne(
      { _id: savedItem._id },
      Object.keys({ ...doc, ...meta }).join(" "),
      { readPreference: "primary" }
    );
  }

  async save(
    conditions: Partial<Record<keyof T, unknown>>,
    updateOperation: Record<string, any>,
    meta?: { updatedBy: string; _cid?: string }
  ): Promise<T> {
    const item = await this.model.findOne(conditions as FilterQuery<T>);
    if (!item) throw Error("404 item not found");
    const data = flat(updateOperation, { safe: true });
    item.set(data);
    if (meta) item.set(meta);
    return item.save();
  }

  async findOneOrCreate(
    docs: Partial<Record<keyof T, unknown>>,
    meta?: { updatedBy?: string; createdBy: string; _cid?: string }
  ): Promise<T> {
    let item = await this.model.findOne(docs as FilterQuery<T>);
    if (!item) {
      const newItem = new this.model();
      newItem.set(docs);
      if (meta) newItem.set(meta);
      item = await newItem.save();
      item = await this.model.findOne(
        { _id: item._id },
        Object.keys({ ...docs, ...meta }).join(" "),
        { readPreference: "primary" }
      );
    }
    return item;
  }

  async upsert(
    conditions: Partial<Record<keyof T, unknown>>,
    updateOperation: Record<string, any>,
    meta?: { createdBy: string; _cid?: string }
  ): Promise<T> {
    let item = await this.model.findOne(conditions as FilterQuery<T>);
    if (!item) {
      item = new this.model();
    }
    item.set({
      ...updateOperation,
      ...conditions,
    });
    if (meta) item.set({ ...meta, updatedBy: meta.createdBy });
    await item.save();
    return item;
  }

  async addToSet(
    conditions: Partial<Record<keyof T, unknown>>,
    addToSet: Partial<Record<keyof T, unknown>>,
    meta?: { updatedBy: string; _cid?: string }
  ): Promise<T> {
    const item = await this.model.findOne(conditions as FilterQuery<T>);
    if (!item) throw Error("404 item not found");
    Object.keys(addToSet).forEach(function (key) {
      const value = addToSet[key];
      const i = key.split(".");
      if (i.length == 1) item[i[0]].addToSet(value);
      if (i.length == 2) item[i[0]][i[1]].addToSet(value);
      if (i.length == 3) item[i[0]][i[1]][i[2]].addToSet(value);
    });
    if (meta) item.set({ updatedBy: meta.updatedBy });
    const savedItem = await item.save();
    return await this.model.findOne(
      { _id: savedItem._id },
      Object.keys({ ...addToSet, ...meta }).join(" "),
      { readPreference: "primary" }
    );
  }

  async pull(
    conditions: Partial<Record<keyof T, unknown>>,
    pull: Partial<Record<keyof T, unknown>>,
    meta?: { updatedBy: string; _cid?: string }
  ): Promise<T> {
    const item = await this.model.findOne(conditions as FilterQuery<T>);
    if (!item) throw Error("404 item not found");
    Object.keys(pull).forEach(function (key) {
      const value = pull[key];
      const i = key.split(".");
      if (i.length == 1) item[i[0]].pull(value);
      if (i.length == 2) item[i[0]][i[1]].pull(value);
      if (i.length == 3) item[i[0]][i[1]][i[2]].pull(value);
    });
    if (meta) item.set({ updatedBy: meta.updatedBy });
    const savedItem = await item.save();
    return await this.model.findOne(
      { _id: savedItem._id },
      Object.keys({ ...pull, ...meta }).join(" "),
      { readPreference: "primary" }
    );
  }

  async push(
    conditions: Partial<Record<keyof T, unknown>>,
    push: Partial<Record<keyof T, unknown>>,
    meta?: { updatedBy: string; _cid?: string }
  ): Promise<T> {
    const item = await this.model.findOne(conditions as FilterQuery<T>);
    if (!item) throw Error("404 item not found");
    Object.keys(push).forEach(function (key) {
      const value = push[key];
      const i = key.split(".");
      if (i.length == 1) item[i[0]].push(value);
      if (i.length == 2) item[i[0]][i[1]].push(value);
      if (i.length == 3) item[i[0]][i[1]][i[2]].push(value);
    });
    if (meta) item.set({ updatedBy: meta.updatedBy });
    const savedItem = await item.save();
    return await this.model.findOne(
      { _id: savedItem._id },
      Object.keys({ ...push, ...meta }).join(" "),
      { readPreference: "primary" }
    );
  }

  async remove(
    conditions: Partial<Record<keyof T, unknown>>,
    meta?: { updatedBy: string; _cid?: string }
  ): Promise<T> {
    const item = await this.model.findOne(conditions as FilterQuery<T>);
    if (!item) throw Error("404 item not found");
    if (meta) item.set(meta);
    return item.remove();
  }

  cursor(
    conditions: Partial<Record<keyof T, unknown>>,
    options?: Record<string, unknown>
  ): QueryCursor<T> {
    if (!options.batchSize) options.batchSize = 200;
    return this.model
      .find(conditions as FilterQuery<T>)
      .populate(options.populate)
      .cursor({ batchSize: options.batchSize });
  }
}
