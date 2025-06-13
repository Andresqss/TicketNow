import prisma from "../lib/prisma.js";

export const createTicketReservation = async (req, res) => {
  try {
    const { event_id, quantity, total_price, selectedSeats } = req.body;
    const userId = req.user.user_id;
    const event = await prisma.events.findUnique({
      where: { event_id: parseInt(event_id) },
      include: {
        ticket_reservations: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const totalReserved = event.ticket_reservations.reduce(
      (sum, reservation) => sum + reservation.quantity,
      0
    );
    const availableSeats = event.capacity - totalReserved;

    if (quantity > availableSeats) {
      return res.status(400).json({
        message: `Solo quedan ${availableSeats} asientos disponibles`,
      });
    }

    const calculatedTotalPrice = selectedSeats
      ? quantity * selectedSeats.price
      : quantity * event.base_price;

    const reservation = await prisma.ticket_reservations.create({
      data: {
        user_id: userId,
        event_id: parseInt(event_id),
        quantity: parseInt(quantity),
        total_price: calculatedTotalPrice,
      },
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({
      message: "Error creating reservation",
      error: error.message,
    });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const reservations = await prisma.ticket_reservations.findMany({
      where: {
        user_id: userId,
      },
      include: {
        events: {
          include: {
            event_schedules: true,
          },
        },
      },
      orderBy: {
        reserved_at: "desc",
      },
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations" });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.user_id;

    const reservation = await prisma.ticket_reservations.findUnique({
      where: {
        reservation_id: parseInt(reservationId),
      },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reservation.user_id !== userId) {
      return res.status(403).json({
        message: "No autorizado para cancelar esta reserva",
        details: {
          reservationUserId: reservation.user_id,
          requestUserId: userId,
        },
      });
    }

    await prisma.ticket_reservations.delete({
      where: {
        reservation_id: parseInt(reservationId),
      },
    });

    res.json({ message: "Reserva cancelada exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al cancelar la reserva",
      error: error.message,
    });
  }
};

export const checkUserToken = async (req, res) => {
  try {
    res.json({
      tokenUser: req.user,
      message: "Token decoded successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking token" });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.user_id;

    const reservation = await prisma.ticket_reservations.findUnique({
      where: {
        reservation_id: parseInt(reservationId),
      },
      include: {
        events: true,
      },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reservation.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "No autorizado para editar esta reserva" });
    }

    const event = await prisma.events.findUnique({
      where: { event_id: reservation.event_id },
      include: {
        ticket_reservations: {
          where: {
            NOT: {
              reservation_id: parseInt(reservationId),
            },
          },
        },
      },
    });

    const totalReserved = event.ticket_reservations.reduce(
      (sum, res) => sum + res.quantity,
      0
    );
    const availableSeats = event.capacity - totalReserved;
    if (quantity > availableSeats) {
      return res.status(400).json({
        message: `Solo quedan ${availableSeats} asientos disponibles`,
      });
    }

    const newTotalPrice = quantity * event.base_price;

    const updatedReservation = await prisma.ticket_reservations.update({
      where: {
        reservation_id: parseInt(reservationId),
      },
      data: {
        quantity: quantity,
        total_price: newTotalPrice,
      },
    });

    res.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({
      message: "Error al actualizar la reserva",
      error: error.message,
    });
  }
};
