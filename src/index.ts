import express, { Request, Response } from "express";
import dotenv from "dotenv";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from './routes/ProtectedRoutes'

dotenv.config();
import "./config/db";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true,limit:"200mb" }));
const PORT = process.env.PORT || 3000;

app.use(PublicRoutes);
app.use(ProtectedRoutes)

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
