require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        database: mongoose.connection.readyState === 1 ? "mongodb" : "in-memory-fallback",
    });
});

app.use("/api/notes", noteRoutes);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.message.startsWith("Not allowed by CORS") ? 403 : 500).json({
        message: err.message || "Server error",
    });
});

async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
