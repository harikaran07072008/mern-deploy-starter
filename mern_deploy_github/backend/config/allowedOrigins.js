const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ""));
}

module.exports = allowedOrigins;
