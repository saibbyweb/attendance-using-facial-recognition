import { mongoose } from "@server/helpers/essentials";
import { CommonSchema, DocType, MongoModel } from "@server/types/global";

/* Class type */
export interface Class<T extends DocType = DocType.MONGO> extends CommonSchema {
  courseCode: string;
  subject: string;
  course: string;
  batch: string;
  semester: string;
}

/* class model */
export type ClassModel = MongoModel<Class, Class<DocType.BASE>>;

/* class schema */
const schema = new mongoose.Schema<Class, ClassModel>(
  {
    /* course code */
    courseCode: { type: String, required: true },
    /* subject */
    subject: { type: String, required: true },
    /* course */
    course: { type: String, required: true },
    /* batch */
    batch: { type: String, required: true },
    /* semester */
    semester: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

/* exporting driver model */
export const model = mongoose.model<Class, ClassModel>("class", schema);
export const register = () => console.log("class registered 🎉");
export default { model, register };
