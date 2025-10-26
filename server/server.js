const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const connectMongoDB = require("./config/mongodb"); // NEW
const queryRoutes = require("./routes/queryRoutes");
const authRoutes = require("./routes/authRoutes"); // NEW
require("dotenv").config();

const app = express();

// Connect MongoDB (optional, won't break if missing)
connectMongoDB(); // NEW

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'https://nlq-frontend.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Library NLQ Backend API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      query: '/api/query',
      schema: '/api/schema',
      auth: '/api/auth/login' // NEW
    }
  });
});

app.get('/health', (req, res) => {
  res.json({msg : "server is running!!"});
})

// Routes
app.use("/api/auth", authRoutes); // NEW - Auth routes
app.use("/api", queryRoutes); // Existing routes

// Test database connection
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM books");
    res.json({
      status: "healthy",
      database: "connected",
      bookCount: rows[0].count,
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

// Only listen locally, not on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⚕️ Check server health on http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
