import { server } from "@server/helpers/essentials"
import { PostReq, Res } from "@server/types/global";
/* creating express router */
const router = server.express.Router();


/* crud api */
router.post('/crud', async (req: PostReq<{}>, res: Res<{}>) => {

    
})
export default {router};

