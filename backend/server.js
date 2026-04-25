import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import applicantRoutes from "./src/routes/applicant.routes.js";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const frontendDistPath = path.join(__dirname, "dist");
app.use(express.static(frontendDistPath));

// API routes
app.use("/api", applicantRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running" });
});

// Catch unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        error: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// SPA fallback
app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

connectDB();