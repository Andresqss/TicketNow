import express from "express";
import {
  getAllEventTypes,
  getEventTypeById,
  createEventType,
  updateEventType,
  deleteEventType,
} from "../controllers/eventTypeController.js";

const router = express.Router();

router.get("/event-types", getAllEventTypes);
router.get("/event-types/:id", getEventTypeById);
router.post("/event-types", createEventType);
router.put("/event-types/:id", updateEventType);
router.delete("/event-types/:id", deleteEventType);

export default router;
