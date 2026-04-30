import mongoose from "mongoose";

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 25000,
    socketTimeoutMS: 25000,
    connectTimeoutMS: 25000,
    maxPoolSize: 5,
    minPoolSize: 0,
    bufferCommands: true
  });

  console.log("MongoDB connected");
};
