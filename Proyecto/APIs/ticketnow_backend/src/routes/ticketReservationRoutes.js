import express from "express";
import {
  createTicketReservation,
  getUserReservations,
  cancelReservation,
  checkUserToken,
  updateReservation,
} from "../controllers/ticketReservationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { generateReservationPDF } from "../controllers/pdfController.js";
import { createGuestReservation } from "../controllers/guestReservationController.js";

const router = express.Router();

router.post("/ticket-reservations", authenticateToken, createTicketReservation);
router.get("/my-reservations", authenticateToken, getUserReservations);
router.delete(
  "/ticket-reservations/:reservationId",
  authenticateToken,
  cancelReservation
);
router.get("/check-token", authenticateToken, checkUserToken);
router.get(
  "/ticket-reservations/:reservationId/pdf",
  authenticateToken,
  generateReservationPDF
);
router.put(
  "/ticket-reservations/:reservationId",
  authenticateToken,
  updateReservation
);
router.post("/guest-reservations", createGuestReservation);

export default router;
