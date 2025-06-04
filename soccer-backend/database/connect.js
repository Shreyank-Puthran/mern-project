import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
