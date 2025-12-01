import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";
import session from "express-session";
import cookieParser from "cookie-parser";
import pageRoutes from "./routes/pages";


import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import patientRoutes from "./routes/patients";
import foodRoutes from "./routes/foods";
import recipeRoutes from "./routes/recipes";
import dietPlanRoutes from "./routes/dietPlans";
import chatRoutes from "./routes/chat";
import reminderRoutes from "./routes/reminders";
import healthRecordRoutes from "./routes/healthRecords";

import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie & Session
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Compression
app.use(compression());

// Rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check
app.get("/health", (req, res) =>
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
);

// Page / view routes (if using SSR)
app.use("/", pageRoutes);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/diet-plans", dietPlanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/health-records", healthRecordRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Create HTTP server and attach socket.io
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📌 Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;