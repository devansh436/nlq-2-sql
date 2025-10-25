const express = require("express");
const router = express.Router();
const { executeNLQuery } = require("../services/sqlService");
const { extractSchema } = require("../utils/schemaExtractor");
const { authenticate } = require("../middleware/auth");
const { getRolePermissions } = require("../middleware/roleValidator");

// Main NLQ endpoint (requires authentication)
router.post("/query", authenticate, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required" });
    }

    // Get user role from authenticated request
    const userRole = req.userRole;

    console.log(`\n📝 Query Request:
User: ${req.user.username}
Role: ${userRole}
Question: ${question}
`);

    // Execute query with role-based validation
    const result = await executeNLQuery(question, userRole);

    // Log result
    if (result.success) {
      console.log(`✅ Query successful - ${result.rowCount} rows returned`);
    } else {
      console.log(`❌ Query failed: ${result.error}`);
    }

    res.json(result);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get database schema (requires authentication)
router.get("/schema", authenticate, async (req, res) => {
  try {
    const schema = await extractSchema();
    const userRole = req.userRole;
    const permissions = getRolePermissions(userRole);

    res.json({
      schema,
      userRole,
      permissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's role permissions
router.get("/permissions", authenticate, async (req, res) => {
  try {
    const userRole = req.userRole;
    const permissions = getRolePermissions(userRole);

    res.json({
      success: true,
      role: userRole,
      permissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
