import { mongoose } from "@server/helpers/essentials";
import { CommonSchema, DocType, MongoModel } from "@server/types/global";

/* Faculty type */
export interface Faculty<T extends DocType = DocType.MONGO> extends CommonSchema {
  employeeId: string;
  firstName: string;
  lastName: string;
  classes: any;
}

/* class model */
export type FacultyModel = MongoModel<Faculty, Faculty<DocType.BASE>>;

/* class schema */
const schema = new mongoose.Schema<Faculty, FacultyModel>(
  {
    /* course code */
    employeeId: { type: String, required: true },
    /* first name */
    firstName: { type: String, required: true },
    /* last name */
    lastName: { type: String, required: true },
    /* classes */
    classes: { type: Array, required: true }
  },
  {
    timestamps: true,
  }
);

/* exporting driver model */
export const model = mongoose.model<Faculty, FacultyModel>("faculty", schema);
export const register = () => console.log("faculty registered 🎉");
export default { model, register };
