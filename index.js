import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dbConnect from "./utils/db.utils.js";
import userRoutes from "./routes/user.routes.js";
import { config } from "./config/env.config.js";

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(helmet()); // secure HTTP headers
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.set("trust proxy", 1); // required for rate limiter middleware

// CORS setup
app.use(
  cors({
    origin: config.urls.frontend,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connection to database
dbConnect();

// Healthcheck endpoint
app.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "Ok",
    message: "Server is running",
    environment: config.env,
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Routes
app.use("/api/v1/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: config.env === "development" ? err.message : null,
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${config.env} mode`);
});
