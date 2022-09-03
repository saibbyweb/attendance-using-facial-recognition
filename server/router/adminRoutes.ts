import { server, db } from "@server/helpers/essentials";
import { PostReq, Res } from "@server/types/global";
import { Class } from "@server/models/class";
/* creating express router */
const router = server.express.Router();

type ModelDoc = Class & { _id?: string };

/* crud request  */
type CRUDRequestBody = {
  operation: "read" | "add" | "update" | "delete";
  modelName: "class" | string;
  payload: ModelDoc;
};

/* crud response */
type CRUDResponse = {
  docs?: Array<ModelDoc>;
  newDoc?: ModelDoc;
};

/* crud api */
router.post("/crud", async (req: PostReq<CRUDRequestBody>, res: Res<CRUDResponse>) => {
  console.log("hi 👋", req.body);
  let response: CRUDResponse = {};
  /* extract operation, modelName & payload */
  const { operation, modelName, payload } = req.body;

  switch (operation) {
    case "read":
      response.docs = await db.model(modelName).find().lean();
      break;
    case "add":
      const model = db.model(modelName);
      await new model(payload).save();
      break;
    case "update":
      const { _id, ...rest } = payload;
      await db.model(modelName).findByIdAndUpdate(payload._id, rest);
      break;
    case "delete":
      break;
  }

  res.send({ msg: "Done", data: response });
});
export default router;
