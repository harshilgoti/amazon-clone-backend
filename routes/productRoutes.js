import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("merchant", "admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("merchant", "admin"), updateProduct)
  .delete(protect, authorize("merchant", "admin"), deleteProduct);

export default router;
