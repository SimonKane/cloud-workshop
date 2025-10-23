import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = (global as any).mongoose as
  | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
  | undefined;

if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function connectDB() {
  const c = cached!;
  if (c.conn) return c.conn;
  if (!c.promise) {
    try {
      console.log("Connecting to MongoDB...");
      c.promise = mongoose.connect(MONGODB_URI!, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      });
    } catch (error) {
      console.error("Failed to create MongoDB connection:", error);
      throw error;
    }
  }
  try {
    c.conn = await c.promise;
    console.log("MongoDB connected successfully");
    return c.conn;
  } catch (error) {
    console.error("Failed to establish MongoDB connection:", error);
    c.promise = null; // Reset promise so it can retry
    throw error;
  }
}
