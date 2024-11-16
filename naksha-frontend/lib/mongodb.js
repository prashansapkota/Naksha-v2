import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://prashan:123@cluster0.zx6wy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI);
}

export const connectMongoDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}; 