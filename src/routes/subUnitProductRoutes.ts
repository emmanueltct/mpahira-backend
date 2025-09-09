// File: routes/subUnitProductRoutes.ts
import { Router } from "express";
import { createSubUnit, getAllSubUnit,getOneSubUnit,deleteSubUnit,updateSubUnit} from "../controllers/subUnitProductController";
import {
  createSubUnitProductSchema,
  updateSubUnitProductSchema,
  getOrDeleteSubUnitProductSchema,
} from "../validations/subUnitProductValidator"

import {validateSubUnitsProduct} from "../middleware/isValidSubUnit";

const router = Router();

router.post(
  "/",
  validateSubUnitsProduct(createSubUnitProductSchema),

  createSubUnit
);

router.get("/", getAllSubUnit);


router.get(
  "/:id",
  validateSubUnitsProduct(getOrDeleteSubUnitProductSchema),
  getOneSubUnit
);

router.put(
  "/:id",
  validateSubUnitsProduct(updateSubUnitProductSchema),
 updateSubUnit
);

router.delete(
  "/:id",
  validateSubUnitsProduct(getOrDeleteSubUnitProductSchema),
  deleteSubUnit
);

export default router;
