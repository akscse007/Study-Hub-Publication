import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "MONGODB_URI is not set. Set it to your MongoDB Atlas connection string in the deployment environment."
      );
    }
    console.warn("WARNING: MONGODB_URI is not set — falling back to local MongoDB (development only).");
  }

  await mongoose.connect(uri || "mongodb://127.0.0.1:27017/studyhub_publication");
};

export default connectDB;
