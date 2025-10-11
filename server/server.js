const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const queryRoutes = require("./routes/queryRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", queryRoutes);

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
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
