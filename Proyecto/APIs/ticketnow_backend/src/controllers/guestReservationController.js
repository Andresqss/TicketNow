import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";

export const createGuestReservation = async (req, res) => {
  try {
    const { event_id, quantity, guest_email, guest_name, guest_phone, selectedSeats } = req.body;

    if (!event_id || !quantity || !guest_email || !guest_name || !guest_phone) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos",
        required: {
          event_id: !!event_id,
          quantity: !!quantity,
          guest_email: !!guest_email,
          guest_name: !!guest_name,
          guest_phone: !!guest_phone
        }
      });
    }

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
      (sum, res) => sum + res.quantity,
      0
    );

    if (quantity > (event.capacity - totalReserved)) {
      return res.status(400).json({
        message: `Solo quedan ${event.capacity - totalReserved} asientos disponibles`,
      });
    }

    const totalPrice = selectedSeats 
      ? quantity * selectedSeats.price
      : quantity * event.base_price;

    const reservation = await prisma.ticket_reservations.create({
      data: {
        event_id: parseInt(event_id),
        quantity: parseInt(quantity),
        total_price: totalPrice,
        guest_email,
        guest_name,
        guest_phone,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: guest_email,
      subject: `Confirmación de reserva - ${event.event_name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: 'Helvetica', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #06b6d4, #0891b2);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 0 0 8px 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .ticket-info {
                background: #f3f4f6;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .total-row {
                font-size: 1.2em;
                font-weight: bold;
                color: #06b6d4;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 2px solid #e5e7eb;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 0.9em;
                color: #6b7280;
              }
              .qr-placeholder {
                text-align: center;
                margin: 20px 0;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>¡Gracias por tu reserva!</h1>
            </div>
            <div class="content">
              <p>Hola ${guest_name},</p>
              <p>Tu reserva ha sido confirmada para el evento <strong>"${event.event_name}"</strong>.</p>
              
              <div class="ticket-info">
                <div class="detail-row">
                  <span>Número de reserva:</span>
                  <strong>#${reservation.reservation_id}</strong>
                </div>
                <div class="detail-row">
                  <span>Cantidad de tickets:</span>
                  <strong>${quantity}</strong>
                </div>
                ${selectedSeats ? `
                <div class="detail-row">
                  <span>Zona:</span>
                  <strong>${selectedSeats.name}</strong>
                </div>` : ''}
                <div class="detail-row">
                  <span>Fecha del evento:</span>
                  <strong>${new Date(event.start_datetime).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</strong>
                </div>
                <div class="detail-row total-row">
                  <span>Total:</span>
                  <strong>$${totalPrice}</strong>
                </div>
              </div>

              <div class="qr-placeholder">
                <p>Código QR de tu reserva</p>
                <img src="cid:qr-code" alt="QR Code" style="max-width: 200px;"/>
              </div>

              <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>Para cualquier consulta, contáctanos a través de nuestro sitio web.</p>
                <p>&copy; ${new Date().getFullYear()} TicketNow. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    res.status(201).json({
      message: "Reserva creada exitosamente",
      reservation_id: reservation.reservation_id,
    });

  } catch (error) {
    console.error("Error creating guest reservation:", error);
    res.status(500).json({
      message: "Error al crear la reserva",
      error: error.message,
    });
  }
};