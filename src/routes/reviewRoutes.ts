import { Router } from "express";
import {
  createReview,
  getApprovedReviews,
  approveReview,
  deleteReview,
} from "../controllers/productReviewController";

const router = Router();

router.post("/", createReview);
router.get("/", getApprovedReviews);
router.patch("/:id/approve", approveReview);
router.delete("/:id", deleteReview);

export default router;
