import bcrypt from "bcryptjs";
import User from "../models/users.models.js";
import generateTokenAndSetCookie from "../utils/genetateToken.js";

export const signup = async (req, res) => {
	try {
		// שליפת השדות מהבקשה, כולל userName במקום username
		const { fullName, userName, password, confirmPassword, gender } = req.body;
		
		console.log("Received request body:", req.body);

		// בדיקת התאמת סיסמאות
		if (password !== confirmPassword) {
			console.log("Passwords don't match.");
			return res.status(400).json({ error: "Passwords don't match" });
		}

		// בדיקה האם שם המשתמש קיים כבר במסד הנתונים
		const existingUser = await User.findOne({ userName });
		if (existingUser) {
			console.log("Username already exists:", userName);
			return res.status(400).json({ error: "Username already exists" });
		}

		// הצפנת הסיסמה
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// הגדרת תמונת פרופיל לפי המגדר
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

		// יצירת אובייקט המשתמש החדש עם השדות המתאימים
		const newUser = new User({
			fullName,
			userName, // כאן אנחנו מכניסים את userName כמו שצריך
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		console.log("Attempting to save new user:", newUser);
		await newUser.save();
		console.log("User saved successfully.", newUser);

		// יצירת טוקן ושמירתו בקובץ Cookie
		generateTokenAndSetCookie(newUser._id, res);
		res.status(201).json({
			_id: newUser._id,
			fullName: newUser.fullName,
			userName: newUser.userName,
			profilePic: newUser.profilePic,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const login = async (req, res) => {
	try {
		const { userName, password } = req.body;
		const user = await User.findOne({ userName });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			userName: user.userName,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
