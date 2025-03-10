// to add other libraries or files code, import them here
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./utils/db.utils.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.BASE_URL,
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

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
