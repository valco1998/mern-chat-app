import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./authContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		// אם יש משתמש מחובר, התחבר ל-socket
		if (authUser) {
			const newSocket = io("https://mern-chat-prod-xvyu.onrender.com", {
				auth: {
					userId: authUser._id, // העברת ה-ID של המשתמש כחלק מה-auth
				},
			});

			setSocket(newSocket);

			// התחברות לאירועים שמגיעים מהשרת
			newSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// ניקוי החיבור כאשר הקומפוננטה מתפנה או המשתמש מתחלף
			return () => newSocket.close();
		} else {
			// אם לא קיים משתמש מחובר, סוגרים את החיבור הקודם
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser, socket]); // מוסיפים את ה-socket כתלות במערך, למנוע בעיות בעת עדכון ה-state

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
