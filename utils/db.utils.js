import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err);
    });
};

export default dbConnect;
