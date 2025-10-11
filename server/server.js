const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("", (req, res) => {
  try {
	res.send({ message: "Hello, world" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Test route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM books");
    res.json({ success: true, bookCount: rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on: http://localhost:${PORT}`));
