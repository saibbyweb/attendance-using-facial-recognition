import { server, db } from "@server/helpers/essentials";
import { PostReq, Res } from "@server/types/global";
import { classes, Class } from "@server/models/class";
/* creating express router */
const router = server.express.Router();

type ModelDoc = Class | unknown;

/* crud request  */
type CRUDRequestBody = {
  operation: "read" | "add" | "update" | "delete";
  modelName: "class" | string;
  payload: ModelDoc;
};

/* crud response */
type CRUDResponse = {
  docs?: Array<ModelDoc>,
  newDoc?: ModelDoc
};

/* crud api */
router.post("/crud", async (req: PostReq<CRUDRequestBody>, res: Res<CRUDResponse>) => {
  console.log('hi 👋', req.body);
  let response: CRUDResponse = {};
  /* extract operation, modelName & payload */
  const { operation, modelName, payload } = req.body;
  
  switch (operation) {
    case "read":
      response.docs = await db.model(modelName).find();
      break;
    case "add":
      const model = db.model(modelName);
      response.newDoc = await new model(payload).save();
      break;
    case "update":
      break;
    case "delete":
      break;
  }

  res.send({ msg: "Done", data: response });
});
export default router;
