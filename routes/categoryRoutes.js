import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin", "merchant"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "merchant"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

export default router;
