import prisma from "../lib/prisma.js";

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all active events
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: List of events
 *       500:
 *         description: Server error
 */
export const getAllEvents = async (req, res) => {
  try {
    const { search } = req.query;
    
    const events = await prisma.events.findMany({
      where: {
        is_active: true,
        ...(search && {
          event_name: {
            contains: search,
            mode: 'insensitive'
          }
        })
      },
      include: {
        event_types: true,
        event_schedules: true,
      },
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export const getEventById = async (req, res) => {
  try {
    const event = await prisma.events.findUnique({
      where: {
        event_id: parseInt(req.params.id),
      },
      include: {
        event_schedules: true,
        event_types: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error al obtener el evento" });
  }
};

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_name
 *               - start_datetime
 *               - end_datetime
 *               - capacity
 *             properties:
 *               event_name:
 *                 type: string
 *               description:
 *                 type: string
 *               short_description:
 *                 type: string
 *               event_type_id:
 *                 type: integer
 *               start_datetime:
 *                 type: string
 *                 format: date-time
 *               end_datetime:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *               base_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export const createEvent = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/events/${req.file.filename}` : null;

    const event = await prisma.events.create({
      data: {
        event_name: req.body.event_name,
        description: req.body.description,
        short_description: req.body.short_description,
        image: imageUrl,
        event_type_id: parseInt(req.body.event_type_id),
        start_datetime: new Date(req.body.start_datetime),
        end_datetime: new Date(req.body.end_datetime),
        capacity: parseInt(req.body.capacity),
        base_price: parseFloat(req.body.base_price),
      },
      include: {
        event_types: true,
        event_schedules: true,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_name:
 *                 type: string
 *               description:
 *                 type: string
 *               short_description:
 *                 type: string
 *               event_type_id:
 *                 type: integer
 *               start_datetime:
 *                 type: string
 *                 format: date-time
 *               end_datetime:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *               base_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export const updateEvent = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `/uploads/events/${req.file.filename}`
      : undefined;

    const event = await prisma.events.update({
      where: {
        event_id: parseInt(req.params.id),
      },
      data: {
        event_name: req.body.event_name,
        description: req.body.description,
        short_description: req.body.short_description,
        ...(imageUrl && { image: imageUrl }),
        event_type_id: parseInt(req.body.event_type_id),
        start_datetime: new Date(req.body.start_datetime),
        end_datetime: new Date(req.body.end_datetime),
        capacity: parseInt(req.body.capacity),
        base_price: parseFloat(req.body.base_price),
        updated_at: new Date(),
      },
      include: {
        event_types: true,
        event_schedules: true,
      },
    });

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      message: "Error updating event",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Soft delete an event
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export const deleteEvent = async (req, res) => {
  try {
    await prisma.events.update({
      where: {
        event_id: parseInt(req.params.id),
      },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
};
