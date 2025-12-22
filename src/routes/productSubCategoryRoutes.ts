import { Router } from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/productSubCategoryController";

import {
  createSubCategorySchema,
  updateSubCategorySchema,
  getSubCategoryByIdSchema,
  deleteSubCategorySchema,
} from "../validations/productSubCategoryValidation";

import { validate } from "../middleware/isValidProductSubCategory";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated";
import upload from "../config/multer";

const router = Router();

router.post("/",isAuthenticated, isAdmin,upload.single('image'), validate(createSubCategorySchema), createSubCategory);
router.get("/", getAllSubCategories);
router.get("/:id", validate(getSubCategoryByIdSchema), getSubCategoryById);
router.patch("/:id",isAuthenticated, isAdmin,upload.single('image'), validate(updateSubCategorySchema), updateSubCategory);
router.delete("/:id", validate(deleteSubCategorySchema), deleteSubCategory);

export default router;
