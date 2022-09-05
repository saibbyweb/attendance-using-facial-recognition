import { mongoose } from "@server/helpers/essentials";
import { CommonSchema, DocType, MongoModel } from "@server/types/global";

/* Student type */
export interface Student<T extends DocType = DocType.MONGO> extends CommonSchema {
  enrollmentNo: string;
  firstName: string;
  lastName: string;
  courseCode: any;
  batch: string;
}

/* Student model */
export type StudentModel = MongoModel<Student, Student<DocType.BASE>>;

/* Student schema */
const schema = new mongoose.Schema<Student, StudentModel>(
  {
    /* enrollmentNo code */
    enrollmentNo: { type: String, required: true },
    /* first name */
    firstName: { type: String, required: true },
    /* last name */
    lastName: { type: String, required: true },
    /* classes */
    courseCode: { type: Array, required: true },
    /* batch */
    batch: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

/* exporting driver model */
export const model = mongoose.model<Student, StudentModel>("student", schema);
export const register = () => console.log("student registered 🎉");
export default { model, register };
