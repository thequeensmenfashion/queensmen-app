import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import applicationRoutes from "./routes/applicationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import flyerRoutes from "./routes/flyerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import sendEmail from "./utils/sendEmail.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://queensmen-app.vercel.app",
  "https://thequeensmenfasion.com",
  "https://www.thequeensmenfasion.com",
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS must be BEFORE routes
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowedOrigin = allowedOrigins.includes(origin);

      const isVercelPreview =
        origin.endsWith(".vercel.app") &&
        origin.includes("lavondamaxwell1-cpus-projects");

      if (isAllowedOrigin || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / test routes
app.get("/", (req, res) => {
  res.send("The QueensMen API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully",
  });
});

app.get("/api/version", (req, res) => {
  res.json({
    success: true,
    version: "secure-admin-route-2026-05-22",
  });
});

app.get("/api/test-email", async (req, res) => {
  try {
    const result = await sendEmail({
      to: process.env.OWNER_EMAIL,
      subject: "Test Email from The QueensMen",
      html: "<h2>Email test worked!</h2><p>This came from your backend.</p>",
    });

    res.json({
      success: true,
      message: "Test email attempted.",
      result,
    });
  } catch (error) {
    console.error("Test email error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// API routes
app.use("/api/settings", settingsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/flyers", flyerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/client", clientRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});