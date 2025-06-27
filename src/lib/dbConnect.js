import mongoose from "mongoose";

const connection = {
  isConnected: 0,
};

async function dbConnect() {
  if (connection.isConnected === 1) {
    console.log("Already connected to database");
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(uri);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
