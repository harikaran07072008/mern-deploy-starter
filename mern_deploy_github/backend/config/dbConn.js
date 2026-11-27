const mongoose = require("mongoose");

async function connectDB() {
    const uri = process.env.DATABASE_URI;
    if (!uri) {
        console.warn("DATABASE_URI not set — running with in-memory fallback store.");
        return false;
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    return true;
}

module.exports = connectDB;
