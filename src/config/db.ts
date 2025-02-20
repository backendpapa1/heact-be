import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI as string, {
  dbName: process.env.DB_NAME as string,
});

mongoose.connection.on("connected", () => {
  console.log(`database connected.`);
});
