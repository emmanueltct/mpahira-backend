import { Router } from "express";
import { createRecommendProduct, deleteRecommendProduct, getAllRecommendProducts, getRecommendProductById, updateRecommendProduct } from "../controllers/recommendProductController";


const router = Router();

// Create a new recommendation
router.post("/", createRecommendProduct);

// Get all recommendations
router.get("/", getAllRecommendProducts);

// Get a recommendation by ID
router.get("/shopProduct/:id", getRecommendProductById);

// Update a recommendation by ID
router.put("/:id", updateRecommendProduct);

// Delete a recommendation by ID
router.delete("/:id", deleteRecommendProduct);

export default router;
