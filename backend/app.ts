import express from "express";
import path from "node:path";
import bodyParser from "body-parser";
import feedRoutes from "./routes/feed";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const MONGO_URI = process.env.DB_URI!;
const PORT = 8080;

app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error: any, req: any, res: any, next: any) => {
  // console.log(`Status Code: ${error}`);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// MongoDB connection and server startup
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
