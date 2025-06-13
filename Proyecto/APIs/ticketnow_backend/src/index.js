import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import eventTypeRoutes from "./routes/eventTypeRoutes.js";
import ticketReservationRoutes from "./routes/ticketReservationRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "TicketNow API" });
});

app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", eventTypeRoutes);
app.use("/api", ticketReservationRoutes);

async function connectDB() {
  try {
    await prisma.$connect();
  } catch (error) {
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger documentation available at: http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
