import { createContext, useContext, useState } from "react";

// יצירת ההקשר (Context) של האימות
export const AuthContext = createContext();

// Hook מותאם אישית לגישה מהירה להקשר של האימות
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext); // מחזיר את הערכים מה-AuthContext
};

// רכיב שמספק את ההקשר לכל הצאצאים שלו
export const AuthContextProvider = ({ children }) => {
	// יצירת state של המשתמש המחובר, נטען מ-localStorage או ריק
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

	// אספקת ההקשר (authUser ו-setAuthUser) לכל הרכיבים המוכלים (children)
	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};
