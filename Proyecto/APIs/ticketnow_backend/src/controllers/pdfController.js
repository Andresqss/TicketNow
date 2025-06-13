import PDFDocument from "pdfkit";
import prisma from "../lib/prisma.js";

export const generateReservationPDF = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.user_id;

    const reservation = await prisma.ticket_reservations.findUnique({
      where: {
        reservation_id: parseInt(reservationId),
      },
      include: {
        events: true,
        users: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reservation.user_id !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const doc = new PDFDocument({
      size: [300, 500],
      margins: {
        top: 20,
        bottom: 20,
        left: 30,
        right: 30,
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reserva-${reservationId}.pdf`
    );

    doc.pipe(res);
    doc.rect(10, 10, 280, 480).stroke();
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("TICKET NOW", { align: "center" });

    doc.moveDown(0.5);

    doc.moveTo(10, 60).lineTo(290, 60).stroke();

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Comprobante de Reserva", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("EVENTO", { align: "center" })
      .font("Helvetica")
      .text(reservation.events.event_name, { align: "center" });

    doc.moveDown();

    const detailsY = 160;
    doc.font("Helvetica-Bold").text("Detalles de la Reserva:", 30, detailsY);

    doc.font("Helvetica").fontSize(9);

    const startY = detailsY + 20;
    const lineHeight = 15;
    let currentY = startY;

    const addDetailLine = (label, value) => {
      doc
        .font("Helvetica-Bold")
        .text(label, 30, currentY)
        .font("Helvetica")
        .text(value, 140, currentY);
      currentY += lineHeight;
    };

    addDetailLine("Nº de Reserva:", `#${reservation.reservation_id}`);
    addDetailLine("Cliente:", reservation.users.username);
    addDetailLine("Email:", reservation.users.email);
    addDetailLine("Cantidad:", reservation.quantity.toString());
    addDetailLine("Precio Total:", `$${reservation.total_price}`);
    addDetailLine(
      "Fecha:",
      new Date(reservation.reserved_at).toLocaleDateString()
    );

    doc.rect(100, currentY + 20, 100, 100).fill("black");

    doc
      .fontSize(8)
      .text(
        "Este documento es un comprobante oficial de su reserva.",
        30,
        430,
        { align: "center" }
      )
      .text("Presente este documento al ingresar al evento.", {
        align: "center",
      });

    doc.moveTo(10, 460).lineTo(290, 460).stroke();

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error al generar el PDF" });
  }
};
