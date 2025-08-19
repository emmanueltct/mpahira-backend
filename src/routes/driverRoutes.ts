import { Router } from "express";
import { findDriver, createDriver, useExistingDriver, findAllDriver } from "../controllers/driverController";
import { createDriverSchema, useExistingDriverSchema } from "../validations/driverValidation";
import { validate } from "../middleware/isValidDriver"
const router = Router();

router.get("/", findAllDriver);
router.get("/:telephone", findDriver);
router.post("/:orderId", validate(createDriverSchema), createDriver);
router.post("/use-existing/:orderId", validate(useExistingDriverSchema), useExistingDriver);

export default router;
