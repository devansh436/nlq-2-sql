const express = require('express');
const router = express.Router();
const { executeNLQuery } = require('../services/sqlService');
const { extractSchema } = require('../utils/schemaExtractor');

// Main NLQ endpoint
router.post('/query', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await executeNLQuery(question);

    res.json(result);
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get database schema
router.get('/schema', async (req, res) => {
  try {
    const schema = await extractSchema();
    res.json({ schema });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
