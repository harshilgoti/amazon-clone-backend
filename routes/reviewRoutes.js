import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, createReview);

router.route("/:productId").get(getProductReviews);

router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

export default router;
