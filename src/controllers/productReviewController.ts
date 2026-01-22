import { Request, Response } from "express";
import { Review } from "../models/associations";



// Create review
export const createReview = async (req: Request, res: Response) => {
  try {
    // console.log("9999999999999999999999999999 product review:",req.body)
    const review = await Review.create(req.body);
    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get approved reviews
export const getApprovedReviews = async (_: Request, res: Response) => {
  try {
    const reviews = await Review.findAll({
    //   where: { isApproved: true },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve review
export const approveReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
       res.status(404).json({ success: false, message: "Review not found" });
          return 
    }
    review.isApproved =req.body.isApproved;
    await review.save();

    res.json({ success: true, message: "Review approved", data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Delete review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const deleted = await Review.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ success: false, message: "Review not found" });
       return
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
