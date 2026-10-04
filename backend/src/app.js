
import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Support Ticket API is running",
  });
});

app.use("/api/tickets", ticketRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;