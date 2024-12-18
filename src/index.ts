import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import authrouter from "./routes/authRoutes";
import { PrismaClient } from "@prisma/client";
import { generateAC } from "./utils/generateAccount";
import accountRoutes from "./routes/accountRoutes";
const logFilePath = path.join(__dirname, "logs", "app.log");
export const client = new PrismaClient();
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const log = `{url:${req.url},type:${
    req.method
  },timestamp:${new Date().toLocaleTimeString()}}`;
  // Append the log entry to the file
  fs.appendFile(logFilePath, log, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
});
app.use("/api/v1/auth", authrouter);
app.use("/api/v1/acc", accountRoutes);
app.listen(process.env.PORT, () => {
  console.log("App running on port ", process.env.PORT);
});
