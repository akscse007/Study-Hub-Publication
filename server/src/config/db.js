import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/studyhub_publication";

  await mongoose.connect(uri);
};

export default connectDB;

