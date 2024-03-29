import { HydratedDocument, Types, Model, LeanDocumentOrArray, UpdateWriteOpResult, AnyKeys, AnyObject, Document } from "mongoose";
import { NextFunction, Request, Response } from "express";

/* mongo doc (single or multiple) */
export type MongoDoc<T> = HydratedDocument<T> | Array<HydratedDocument<T>>;
export type MongoDocPromise<T> = Promise<MongoDoc<T>>;
export type MongoDocsPromise<T> = Promise<Array<MongoDoc<T>>>;

export interface CommonSchema {
  _id?: Types.ObjectId;
  createdAt?: boolean | string;
  updatedAt?: boolean | string;
}

/* multiple docs */
export type UpdateMultipleDocsByIdOptions<T> = {
  _ids: Array<string> | Array<Types.ObjectId>;
  fields: Partial<T>;
};

/* base doc */
export type BaseDoc<T> = AnyKeys<T> & AnyObject;

/* export doc type enums */
export enum DocType {
  BASE,
  MONGO,
}

/* object id */
export type ObjectIdFromInput = Types.ObjectId | string;

export type ResultDocument<T, P = void> = Document<unknown, any, T> &
  T & {
    _id: Types.ObjectId;
  } & MongoInstanceMethods<T> &
  P;

/* get multiple docs by their ids */
export type GetByIdsOptions<T> = {
  _ids: Array<string> | Array<Types.ObjectId>;
  select?: Array<keyof T>;
};

export interface MongoCrudHelpers<T, InstanceMethods, BaseDoc> {
  add(this: Model<T>, details: Partial<BaseDoc>): Promise<ResultDocument<T, InstanceMethods>>;
  getByIds(this: Model<T>, details: GetByIdsOptions<T>): Promise<Array<T>>;
  updateByIds(this: Model<T>, options: UpdateMultipleDocsByIdOptions<T>): Promise<UpdateWriteOpResult>;
}

export interface MongoInstanceMethods<T> {
  getId(this: HydratedDocument<T>): Types.ObjectId | String;
}

export type MongoModel<T, BaseDoc = T, StaticMethods = {}, Virtuals = {}, InstanceMethods = {}, Queries = {}> = Model<
  T,
  Queries,
  MongoInstanceMethods<T> & InstanceMethods,
  Virtuals
> &
  MongoCrudHelpers<T, InstanceMethods, BaseDoc> &
  StaticMethods;

/* DocInstance */
export type DocInstance<T, InstanceMethods = {}> = Document<unknown, any, T> & T & MongoInstanceMethods<T> & { _id: Types.ObjectId } & InstanceMethods;

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

/* generic cookies */
export type Cookies = Record<string, any>;
/* generic post request with body and optional cookies */
export type PostReq<ReqBody> = Request<any, any, ReqBody>;
/* generic get request with query params and optional cookies */
export type GetRequest<ReqQuery> = Request<any, any, any, ReqQuery>;
/* generic request with cookies */
export type RequestWithCookies<Req, C extends Cookies> = Omit<Req, "cookies"> & C;

/* base reponse */
interface BaseResponse<Data = any> {
  msg?: string;
  data?: Data;
  errors?: Array<Record<string, string>>;
  meta?: Array<Record<string, any>>;
}

/* base response */
class BaseResponse<Data> implements BaseResponse<Data> {
  constructor() {}
}

/* response wrapper */
export type Res<Payload = {}, Locals = {}> = Response<BaseResponse<Payload>, Locals>;
