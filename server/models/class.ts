import { mongoose } from "@server/helpers/essentials";
import { CommonSchema, DocInstance, BaseDoc, DocType, ResultDocument, MongoModel } from "@server/types/global";

/* session type */
export interface Class<T extends DocType = DocType.MONGO> extends CommonSchema {

}

/* timestamp (mongoose schema) */
const TimeStamp = { type: Date, default: new Date() };

/* class model */
export type ClassModel = MongoModel<Class, Class<DocType.BASE>>;

/* class schema */
const schema = new mongoose.Schema<Class, ClassModel>(
  {
    
  },
  {
    timestamps: true,
  }
);
