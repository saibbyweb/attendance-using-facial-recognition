import { server, db } from "@server/helpers/essentials";
import { PostReq, Res } from "@server/types/global";
import { Class } from "@server/models/class";
import { Student } from "@server/models/student";

/* creating express router */
const router = server.express.Router();

type ModelDoc = Class & { _id?: string };

/* crud request  */
type CRUDRequestBody = {
  operation: "read" | "add" | "update" | "delete";
  modelName: "class" | string;
  payload: ModelDoc;
  filters?: Record<string, string>;
};

/* crud response */
type CRUDResponse = {
  docs?: Array<ModelDoc>;
  newDoc?: ModelDoc;
};

/* crud api */
router.post("/crud", async (req: PostReq<CRUDRequestBody>, res: Res<CRUDResponse>) => {
  // console.log("hi 👋", req.body);
  let response: CRUDResponse = {};
  /* extract operation, modelName & payload */
  let { operation, modelName, payload, filters } = req.body;

  if (!["class", "faculty", "student"].includes(modelName)) {
    return res.send({ msg: "Invalid request" })
  }

  switch (operation) {
    case "read":
      if (!filters)
        filters = {};
      response.docs = await db.model(modelName).find(filters).lean();
      break;
    case "add":
      const model = db.model(modelName);
      await new model(payload).save();
      break;
    case "update":
      const { _id, ...rest } = payload;
      await db.model(modelName).findByIdAndUpdate(_id, rest);
      break;
    case "delete":
      await db.model(modelName).findByIdAndDelete(payload._id);
      break;
    default:
      res.send({ msg: "invalid operation", data: {} });
      return;
  }

  res.send({ msg: "Done", data: response });
});
/* get student list request payload */
type GetStudentsList = {
  classId: string;
}

/* get list of students in a class */
router.post("/getStudentsInAClass", async (req: PostReq<GetStudentsList>, res: Res<Student[]>) => {
  
  let response: Student[] = [];
  /* extract classId from request */
  let { classId } = req.body;
  response = await db.model("student").find({ 'classes.value': classId }).lean()
  res.send({ msg: "Done", data: response })
})

/* update attendance request payload */
type UpdateAttendanceReqPayload = {
  classId: string,
  date: string,
  studentList: string[]
}

/* update attendance for a class */
router.post("/updateAttendance", async(req: PostReq<UpdateAttendanceReqPayload>, res: Res) => {
  console.log("hi 👋", req.body);
})
export default router;
