import express from "express";
import {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, getUserOrders);

router.route("/:id").get(protect, getOrder);

router.route("/:id/pay").put(protect, updateOrderToPaid);

router
  .route("/:id/deliver")
  .put(protect, authorize("admin"), updateOrderToDelivered);

export default router;
