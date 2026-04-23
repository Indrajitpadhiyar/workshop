import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import applicantRoutes from "./src/routes/applicant.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files
const frontendDistPath = path.join(__dirname, "dist");
app.use(express.static(frontendDistPath));

// API routes
app.use("/api", applicantRoutes);

// SPA fallback - serve index.html for all non-API routes
app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

connectDB();
