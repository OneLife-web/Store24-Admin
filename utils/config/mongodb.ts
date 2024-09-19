import mongoose, { ConnectOptions } from "mongoose";

// MongoDB connection string
const mongoURI: string = process.env.MONGODB_URI || "";

// Function to connect to MongoDB
const connectToMongoDB = async (): Promise<void> => {
  try {
    // Connect to MongoDB without the deprecated options
    await mongoose.connect(mongoURI, {
      // Add any required connection options here
    } as ConnectOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export async function connectToDb(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    await connectToMongoDB();
  }
}
