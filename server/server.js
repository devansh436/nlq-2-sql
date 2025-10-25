const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const connectMongoDB = require("./config/mongodb");
const queryRoutes = require("./routes/queryRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

// Connect to MongoDB for authentication
connectMongoDB();

// Middleware - CORS must be first
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173",
        "https://nlq-2-sql-fronted.vercel.app",
      ];

      // Allow any vercel.app subdomain
      if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in production for now
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Library NLQ Backend API with Role-Based Access Control",
    status: "running",
    version: "2.0.0",
    features: [
      "MongoDB Authentication",
      "Role-Based Query Validation (USER, STAFF, ADMIN)",
      "Natural Language to SQL with LLM",
      "Secure Query Execution",
    ],
    endpoints: {
      health: "/api/health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        permissions: "GET /api/auth/permissions",
      },
      query: {
        execute: "POST /api/query (requires auth)",
        schema: "GET /api/schema (requires auth)",
        permissions: "GET /api/permissions (requires auth)",
      },
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ msg: "server is running!!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", queryRoutes);

// Test database connection
app.get("/api/health", async (req, res) => {
  const mongoose = require("mongoose");
  const healthStatus = {
    status: "healthy",
    server: "running",
    timestamp: new Date().toISOString(),
  };

  // Check MongoDB
  try {
    healthStatus.mongodb =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch (error) {
    healthStatus.mongodb = "error: " + error.message;
  }

  // Check MySQL
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM books");
    healthStatus.mysql = "connected";
    healthStatus.bookCount = rows[0].count;
  } catch (error) {
    healthStatus.mysql = "disconnected";
    healthStatus.mysqlError = error.message;
    // Don't return error status - server is still running
  }

  res.json(healthStatus);
});

const PORT = process.env.PORT || 5000;
// Only listen locally, not on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(
      `⚕️ Check server health on http://localhost:${PORT}/api/health`
    );
    console.log(`🔐 Authentication enabled with MongoDB`);
    console.log(`📊 Role-based access control active`);
  });
}

module.exports = app;
