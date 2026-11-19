// Importing necessary modules and packages
const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");
const os = require("os");
const fs = require("fs");

// Loading environment variables from .env file
dotenv.config({ path: path.join(__dirname, ".env") });


// Setting up port number
const PORT = process.env.PORT || 4000;

// Connecting to database
database.connect();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: os.tmpdir(),
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// API health check
app.get("/api-status", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Unknown API routes
app.use("/api", (req, res) => {
	return res.status(404).json({ success: false, message: "API route not found" });
});

// Serve the React production build (created by `npm run build`) if it exists.
// During development the React app runs separately on port 3000 instead.
const buildPath = path.join(__dirname, "../build");
if (fs.existsSync(path.join(buildPath, "index.html"))) {
	app.use(express.static(buildPath));
	app.get("*", (req, res) => {
		return res.sendFile(path.join(buildPath, "index.html"));
	});
} else {
	app.get("/", (req, res) => {
		return res.json({
			success: true,
			message: "Your server is up and running ...",
		});
	});
}

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
