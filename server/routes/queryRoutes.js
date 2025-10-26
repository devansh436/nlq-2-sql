const express = require('express');
const router = express.Router();
const { executeNLQuery } = require('../services/sqlService');
const { extractSchema } = require('../utils/schemaExtractor');
const { optionalAuth } = require('../middleware/auth'); // NEW
const { filterTablesByRole } = require('../utils/roleValidator'); // NEW
const pool = require('../config/db'); // NEW

// Apply optional auth to all routes (doesn't break existing)
router.use(optionalAuth); // NEW

// Main NLQ endpoint (now with optional role-based filtering)
router.post('/query', async (req, res) => {
  try {
    const { question } = req.body;
    const userRole = req.user?.role; // Get role if authenticated

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await executeNLQuery(question, userRole); // Pass role
    res.json(result);
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get database schema (filtered by role)
router.get('/schema', async (req, res) => {
  try {
    const userRole = req.user?.role;
    const schema = await extractSchema(userRole); // Pass role
    res.json({ schema });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW - Get tables (filtered by role)
router.get('/tables', async (req, res) => {
  try {
    const userRole = req.user?.role;
    const allowedTables = filterTablesByRole(userRole);

    const tableData = {};
    for (const tableName of allowedTables) {
      const [rows] = await pool.query(`SELECT * FROM ${tableName} LIMIT 100`);
      tableData[tableName] = rows;
    }

    res.json({ 
      tables: tableData, 
      allowedTables,
      userRole: userRole || 'GUEST' // Show role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
