import { useEffect, useState } from "react"; // מייבא את useEffect ו-useState מ-React
import toast from "react-hot-toast"; // מייבא את toast מספריית react-hot-toast להצגת הודעות טוסטר (הודעות קטנות שנעלמות לבד)

const useGetConversations = () => {
    // יוצר hook מותאם אישית בשם useGetConversations

	const [loading, setLoading] = useState(false); // מגדיר מצב 'loading' כדי לעקוב האם המידע בטעינה. ערך התחלתי: false
	const [conversations, setConversations] = useState([]); // מגדיר מצב 'conversations' כדי לאחסן את רשימת השיחות. ערך התחלתי: מערך ריק

	useEffect(() => {
		// useEffect רץ פעם אחת כאשר הקומפוננטה נטענת לראשונה (בזכות התלות הריקה [])

		const getConversations = async () => {
			// מגדיר פונקציה אסינכרונית בשם getConversations כדי להביא את רשימת השיחות מהשרת
			setLoading(true); // מתחיל את הטעינה בכך שמעדכן את המצב של 'loading' ל-true

			try {
				const res = await fetch("/api/users"); // שולח בקשת fetch לנתיב '/api/users' כדי לקבל את רשימת השיחות
				const data = await res.json(); // ממיר את התגובה לפורמט JSON ושומר אותה ב-'data'

				if (data.error) {
					// בודק אם התגובה כוללת שגיאה (אם יש שדה 'error' ב-data)
					throw new Error(data.error); // זורק שגיאה עם הודעת השגיאה, מה שיעביר את הקוד לבלוק catch
				}

				setConversations(data); // מעדכן את המצב של 'conversations' עם המידע שהתקבל (רשימת השיחות)
			} catch (error) {
				// בלוק לתפיסת שגיאות אם הבקשה נכשלת או אם יש בעיה עם התגובה
				toast.error(error.message); // מציג הודעת שגיאה באמצעות toast עם ההודעה של השגיאה
			} finally {
				setLoading(false); // מסיים את הטעינה בכך שמעדכן את המצב של 'loading' ל-false
			}
		};

		getConversations(); // קורא לפונקציה האסינכרונית getConversations כדי להתחיל את תהליך הבקשה
	}, []); // התלות הריקה [] אומרת ל-useEffect לרוץ פעם אחת בלבד בעת הטעינה הראשונית של הקומפוננטה

	return { loading, conversations }; // מחזיר אובייקט עם 'loading' ו-'conversations' כך שה-Hook המותאם אישית יחזיר את המצב הנוכחי לשימוש ברכיבים אחרים
};

export default useGetConversations; // מייצא את useGetConversations כדי לאפשר שימוש בו בקבצים אחרים
