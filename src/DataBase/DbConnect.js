import mongoose from "mongoose";

export const ConnectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}${process.env.DB_NAME}`);
    console.log("Data base is conneted successfully");
  } catch (error) {
    console.log("something went wrong while connecting to database  ", error);
  }
};
