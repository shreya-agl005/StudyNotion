const mongoose = require("mongoose");
const path = require("path");
const dns = require("dns");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

if (dns.setDefaultResultOrder) {
	dns.setDefaultResultOrder("ipv4first");
}

const { seedDatabase } = require("../utils/seedData");

exports.connect = () => {
	const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/StudyNotion";
	mongoose
		.connect(MONGODB_URL)
		.then(async () => {
			console.log(`DB Connection Success`);
			await seedDatabase();
		})
		.catch((err) => {
			console.log(`DB Connection Failed:`, err.message || err);
			if (/querySrv|ENOTFOUND/.test(err.message)) {
				console.log(
					"The MongoDB host in MONGODB_URL (server/.env) could not be found. " +
						"Copy a fresh connection string from MongoDB Atlas (Connect -> Drivers), " +
						"or point it at a local MongoDB: mongodb://127.0.0.1:27017/studynotion"
				);
			}
			process.exit(1);
		});
};
