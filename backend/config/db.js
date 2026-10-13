const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ai-interview-prep";
        await mongoose.connect(mongoURL, {});
        console.log("Mongoose Connected");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
};

module.exports = connectDB;