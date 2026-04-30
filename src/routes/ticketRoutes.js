import express from "express";

import {
  closeTicket,
  createTicket,
  deleteTicket,
  getTicket,
  getTickets,
  reopenTicket,
  replyToTicket
} from "../controllers/ticketController.js";
import { protect, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicket);
router.post("/:id/reply", protect, replyToTicket);
router.put("/:id/close", protect, requireAdmin, closeTicket);
router.put("/:id/reopen", protect, requireAdmin, reopenTicket);
router.delete("/:id", protect, requireAdmin, deleteTicket);

export default router;
