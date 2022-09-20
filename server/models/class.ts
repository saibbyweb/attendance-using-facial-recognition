import { mongoose, ObjectId } from "@server/helpers/essentials";
import { CommonSchema, DocType, MongoModel } from "@server/types/global";

/* attendance record */
type AttendanceRecord = {
  date: string,
  studentList: Array<string>,
}

/* Class type */
export interface Class<T extends DocType = DocType.MONGO> extends CommonSchema {
  classId: string,
  // courseCode: string;
  subject: string;
  course: string;
  batch: string;
  semester: string;
  attendance: Array<AttendanceRecord> | undefined;
}

/* class model */
export type ClassModel = MongoModel<Class, Class<DocType.BASE>>;

/* class schema */
const schema = new mongoose.Schema<Class, ClassModel>(
  {
    /* classId */
    classId: { type: String, required: true },
    /* course code */
    // courseCode: { type: String, required: true },
    /* subject */
    subject: { type: String, required: true },
    /* course */
    course: { type: String, required: true },
    /* batch */
    batch: { type: String, required: true },
    /* semester */
    semester: { type: String, required: true },
    /* attendance */
    attendance: { 
        date: String,
        studentList: Array
     }
  },
  {
    timestamps: true,
  }
);

/* exporting driver model */
export const model = mongoose.model<Class, ClassModel>("class", schema);
export const register = () => { 
  console.log("class registered 🎉")
};
export default { model, register };
