import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `Connected to MongoDB database ${connectionInstance.connection.db.databaseName}, at ${connectionInstance.connection.host}:${connectionInstance.connection.port}`
    );
  } catch (err) {
    console.log("Error in connecting to database", err);
    process.exit(1); //exit with failure
  }
};

export default connectDB;
