import http from "http";
import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Service Ok" });
});

const server = http.createServer(app);

server.listen(() => {
  console.log(`Server is running on port ${PORT}`);
});
