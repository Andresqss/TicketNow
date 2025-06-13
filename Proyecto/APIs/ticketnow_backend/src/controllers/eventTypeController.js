import prisma from "../lib/prisma.js";

/**
 * @swagger
 * /api/event-types:
 *   get:
 *     summary: Get all active Tipo de Eventos
 *     tags: [Tipo de Eventos]
 *     responses:
 *       200:
 *         description: List of Tipo de Eventos
 *       500:
 *         description: Server error
 */
export const getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await prisma.event_types.findMany({
      where: {
        is_active: true,
      },
    });
    res.json(eventTypes);
  } catch (error) {
    console.error("Error fetching Tipo de Eventos:", error);
    res.status(500).json({ message: "Error fetching Tipo de Eventos" });
  }
};

/**
 * @swagger
 * /api/event-types/{id}:
 *   get:
 *     summary: Get event type by ID
 *     tags: [Tipo de Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event type details
 *       404:
 *         description: Event type not found
 *       500:
 *         description: Server error
 */
export const getEventTypeById = async (req, res) => {
  try {
    const eventType = await prisma.event_types.findFirst({
      where: {
        event_type_id: parseInt(req.params.id),
        is_active: true,
      },
    });

    if (!eventType) {
      return res.status(404).json({ message: "Event type not found" });
    }

    res.json(eventType);
  } catch (error) {
    console.error("Error fetching event type:", error);
    res.status(500).json({ message: "Error fetching event type" });
  }
};

/**
 * @swagger
 * /api/event-types:
 *   post:
 *     summary: Create a new event type
 *     tags: [Tipo de Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_name
 *             properties:
 *               type_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event type created successfully
 *       500:
 *         description: Server error
 */
export const createEventType = async (req, res) => {
  try {
    const eventType = await prisma.event_types.create({
      data: {
        ...req.body,
        is_active: true,
      },
    });
    res.status(201).json(eventType);
  } catch (error) {
    console.error("Error creating event type:", error);
    res.status(500).json({ message: "Error creating event type" });
  }
};

/**
 * @swagger
 * /api/event-types/{id}:
 *   put:
 *     summary: Update an event type
 *     tags: [Tipo de Eventos]
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
 *               type_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event type updated successfully
 *       404:
 *         description: Event type not found
 *       500:
 *         description: Server error
 */
export const updateEventType = async (req, res) => {
  try {
    const eventType = await prisma.event_types.update({
      where: {
        event_type_id: parseInt(req.params.id),
      },
      data: {
        ...req.body,
        updated_at: new Date(),
      },
    });
    res.json(eventType);
  } catch (error) {
    console.error("Error updating event type:", error);
    res.status(500).json({ message: "Error updating event type" });
  }
};

/**
 * @swagger
 * /api/event-types/{id}:
 *   delete:
 *     summary: Soft delete an event type
 *     tags: [Tipo de Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event type deleted successfully
 *       404:
 *         description: Event type not found
 *       500:
 *         description: Server error
 */
export const deleteEventType = async (req, res) => {
  try {
    await prisma.event_types.update({
      where: {
        event_type_id: parseInt(req.params.id),
      },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
    res.json({ message: "Event type deleted successfully" });
  } catch (error) {
    console.error("Error deleting event type:", error);
    res.status(500).json({ message: "Error deleting event type" });
  }
};
