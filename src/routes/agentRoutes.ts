import { Router } from "express";
import { AssignMarket, getAgents } from "../controllers/agentController";


const router = Router();

router.get("/", getAgents);
//  router.get("/:id", getAgent);
 router.post("/",AssignMarket);
//router.patch("/:id", AssignMarket);
// router.delete("/:id", deleteAgent);

export default router;
