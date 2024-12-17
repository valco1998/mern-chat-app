import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"], // רשימת המיקומים שמורשים להתחבר
		methods: ["GET", "POST"],
	},
});

const userSocketMap = {}; // {userId: socketId}

// פונקציה שמחזירה את socketId של המשתמש שמתקבל
export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;

	// אם userId מוגדר (ולא undefined), נוסיף אותו למפה
	if (userId && userId !== "undefined") {
		userSocketMap[userId] = socket.id;
	}

	// שולחים את רשימת המשתמשים המחוברים לכל הלקוחות
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// מאזינים לאירועים של ניתוק
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		// מחיקת המשתמש מהמפה כאשר הוא מתנתק
		if (userId) {
			delete userSocketMap[userId];
		}
		// שולחים עדכון לכל הלקוחות על המשתמשים המחוברים
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };