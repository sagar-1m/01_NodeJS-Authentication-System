import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import dbConnect from "./utils/db.utils.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(helmet()); // Add Helmet as a middleware to set various HTTP headers for security

// Basic required variables
const basicRequiredVars = ["FRONTEND_URL", "JWT_SECRET"];
for (const envVar of basicRequiredVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is missing in .env file`);
    process.exit(1);
  }
}

// Database connection validation - either MONGO_URL OR all components must be present
const dbComponents = ["DB_USERNAME", "DB_PASSWORD", "DB_HOST", "DB_NAME"];
if (!process.env.MONGO_URL) {
  // If MONGO_URL is not present, check for all components
  const missingComponents = dbComponents.filter((comp) => !process.env[comp]);
  if (missingComponents.length > 0) {
    console.error(
      `Error: Database configuration incomplete. Missing: ${missingComponents.join(
        ", "
      )}`
    );
    console.error(
      "Either MONGO_URL or all database components (DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME) must be defined"
    );
    process.exit(1);
  }
}

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

dbConnect();

// database connection health check
app.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "Ok",
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
