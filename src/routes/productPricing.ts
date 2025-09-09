import { Router } from "express";
import { createProductPricing, deleteProductPricing, getProductPricingById, getProductPricings, updateProductPricing } from "../controllers/productPricingController";


const router = Router();

router.post("/", createProductPricing);
router.get("/", getProductPricings);
router.get("/:id", getProductPricingById);
router.put("/:id", updateProductPricing);
router.delete("/:id", deleteProductPricing);

export default router;
