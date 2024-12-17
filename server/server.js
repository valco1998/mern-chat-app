import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// ודא שאין ייבוא חוזר של server.js

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/userRoutes.js";

import connectDB from "./db/connectToMongooseDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

server.listen(PORT, () => {
	connectDB();
	console.log(`Server Running on port ${PORT}`);
});