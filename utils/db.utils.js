import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  try {
    if (process.env.MONGO_URL) {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected successfully");
      return;
    }

    const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

    if (!DB_USERNAME || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
      throw new Error(
        "Error: Required environment variables for MongoDB connection are missing"
      );
    }

    const URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
